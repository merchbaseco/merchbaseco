import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh, ShaderMaterial } from "three";
import * as THREE from "three";

const vertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform float uGlow;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;

  vec3 hueShift(vec3 color, float shift) {
    const vec3 k = vec3(0.57735, 0.57735, 0.57735);
    float cosAngle = cos(shift);
    return vec3(color * cosAngle + cross(k, color) * sin(shift) + k * dot(k, color) * (1.0 - cosAngle));
  }

  void main() {
    float gradient = (vPosition.y + 1.0) * 0.5;

    vec3 baseColor = vec3(0.231, 0.027, 0.392);
    vec3 color1 = vec3(0.9, 0.2, 0.8);
    vec3 color2 = vec3(0.5, 0.2, 0.9);
    vec3 color3 = vec3(0.2, 0.4, 1.0);

    vec3 color = baseColor;
    vec3 targetColor;
    if (gradient > 0.5) {
      targetColor = mix(color2, color1, (gradient - 0.5) * 2.0);
    } else {
      targetColor = mix(color3, color2, gradient * 2.0);
    }

    float hueShiftAmount = sin(uTime * 0.8) * 0.6;
    targetColor = hueShift(targetColor, hueShiftAmount);

    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    vec3 normal = normalize(vNormal);

    vec3 keyLight = normalize(vec3(2.0, 3.0, 2.0));
    float keyDiffuse = max(dot(normal, keyLight), 0.0);
    float keySpecular = pow(max(dot(reflect(-keyLight, normal), viewDirection), 0.0), 32.0);

    vec3 fillLight = normalize(vec3(-1.5, 0.5, 1.0));
    float fillDiffuse = max(dot(normal, fillLight), 0.0) * 0.4;

    vec3 rimLight = normalize(vec3(0.0, 0.5, -2.0));
    float rimDiffuse = max(dot(normal, rimLight), 0.0) * 0.3;

    float totalLight = keyDiffuse + fillDiffuse + rimDiffuse + 0.3;
    float lightIntensity = smoothstep(0.0, 0.4, uGlow);
    float colorBlend = smoothstep(0.0, 0.5, uGlow);

    vec3 litColor = targetColor * totalLight * (0.6 + 0.4 * lightIntensity);
    litColor += keySpecular * (0.2 + 0.2 * lightIntensity);

    float fresnel = pow(1.0 - max(dot(viewDirection, normal), 0.0), 3.5);
    litColor += fresnel * (0.2 + 0.15 * lightIntensity);

    float rim = 1.0 - max(dot(viewDirection, normal), 0.0);
    rim = pow(rim, 2.5);
    litColor += rim * vec3(0.4, 0.4, 0.7) * (0.2 + 0.3 * lightIntensity);

    vec3 finalColor = mix(baseColor, litColor, colorBlend);
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

function easeInOutCubic(x: number) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

interface HueShiftingSphereProps {
  isHovered: boolean;
  onLiftProgress?: (value: number) => void;
}

export function HueShiftingSphere({ isHovered, onLiftProgress }: HueShiftingSphereProps) {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<ShaderMaterial>(null);
  const startTime = useRef<number | null>(null);
  const initialTimeRef = useRef<number>(0);
  const hoverState = useRef<{
    active: boolean;
    startTime: number;
    startRotationY: number;
    targetRotationY: number;
  }>({
    active: false,
    startTime: 0,
    startRotationY: 0,
    targetRotationY: 0,
  });
  const hoveredRef = useRef(isHovered);
  const liftState = useRef<{ position: number; velocity: number }>({
    position: 0,
    velocity: 0,
  });
  const scaleState = useRef<{ value: number; velocity: number }>({
    value: 0,
    velocity: 0,
  });

  useEffect(() => {
    const wasHovered = hoveredRef.current;
    hoveredRef.current = isHovered;

    if (isHovered && !wasHovered && meshRef.current) {
      hoverState.current = {
        active: true,
        startTime: 0,
        startRotationY: meshRef.current.rotation.y,
        targetRotationY: meshRef.current.rotation.y + Math.PI * 2,
      };
    }

    if (!isHovered && wasHovered) {
      hoverState.current.active = false;
    }
    liftState.current.velocity = 0;
    scaleState.current.velocity = 0;
  }, [isHovered]);

  useFrame((state, delta) => {
    if (startTime.current === null) {
      startTime.current = state.clock.elapsedTime;
      initialTimeRef.current = state.clock.elapsedTime;
    }

    const elapsed = state.clock.elapsedTime - startTime.current;
    const animationProgress = Math.min(elapsed / 1.2, 1);

    if (meshRef.current) {
      const easedProgress =
        animationProgress < 0.5
          ? 2 * animationProgress * animationProgress
          : -1 + (4 - 2 * animationProgress) * animationProgress;

      const baseScale = 0.85 + easedProgress * 0.2;
      const scaleTarget = hoveredRef.current ? 0.08 : 0;
      const scaleStiffness = hoveredRef.current ? 40 : 24;
      const scaleDamping = hoveredRef.current ? 9 : 11;
      const scaleDisplacement = scaleTarget - scaleState.current.value;
      const scaleAcceleration =
        scaleStiffness * scaleDisplacement - scaleDamping * scaleState.current.velocity;
      scaleState.current.velocity += scaleAcceleration * delta;
      scaleState.current.value += scaleState.current.velocity * delta;
      scaleState.current.value = THREE.MathUtils.clamp(scaleState.current.value, -0.02, 0.1);

      const scale = baseScale + scaleState.current.value;
      meshRef.current.scale.setScalar(scale);

      if (hoverState.current.active) {
        if (hoverState.current.startTime === 0) {
          hoverState.current.startTime = state.clock.elapsedTime;
        }
        const hoverElapsed = state.clock.elapsedTime - hoverState.current.startTime;
        const hoverDuration = 0.9;
        const hoverProgress = Math.min(hoverElapsed / hoverDuration, 1);
        const hoverEased = easeInOutCubic(hoverProgress);

        meshRef.current.rotation.y =
          hoverState.current.startRotationY +
          (hoverState.current.targetRotationY - hoverState.current.startRotationY) * hoverEased;
        meshRef.current.rotation.x += 0.02;

        if (hoverProgress >= 1) {
          hoverState.current.active = false;
        }
      } else {
        meshRef.current.rotation.y += 0.01 + (1 - animationProgress) * 0.02;
        meshRef.current.rotation.x += 0.004 + (1 - animationProgress) * 0.015;
      }

      const targetHeight = hoveredRef.current ? 0.22 : 0;
      const stiffness = hoveredRef.current ? 80 : 45;
      const damping = hoveredRef.current ? 14 : 18;
      const lift = liftState.current;

      const displacement = targetHeight - lift.position;
      const acceleration = stiffness * displacement - damping * lift.velocity;

      lift.velocity += acceleration * delta;
      lift.position += lift.velocity * delta;
      lift.position = THREE.MathUtils.clamp(lift.position, -0.05, 0.28);

      const bobReadiness =
        hoveredRef.current && targetHeight > 0
          ? THREE.MathUtils.clamp(1 - Math.abs(displacement) / targetHeight, 0, 1)
          : 0;
      const bob =
        bobReadiness > 0 ? 0.012 * bobReadiness * Math.sin(state.clock.elapsedTime * 8) : 0;

      meshRef.current.position.y = lift.position + bob;

      if (onLiftProgress) {
        const normalizedHeight = THREE.MathUtils.clamp(lift.position / 0.22, 0, 1);
        onLiftProgress(normalizedHeight);
      }
    }

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime - initialTimeRef.current;
      const intensity = hoveredRef.current
        ? Math.min(animationProgress + 0.3, 1)
        : animationProgress;
      materialRef.current.uniforms.uGlow.value = intensity;
    }
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <sphereGeometry args={[1.5, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uGlow: { value: 0 },
        }}
        side={THREE.FrontSide}
      />
    </mesh>
  );
}

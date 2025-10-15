import { useMemo, useRef } from "react";
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

export function HueShiftingSphere() {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<ShaderMaterial>(null);
  const startTime = useRef<number | null>(null);
  const initialTimeRef = useRef<number>(0);

  useFrame((state) => {
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

      const scale = 0.85 + easedProgress * 0.2;
      meshRef.current.scale.setScalar(scale);
      meshRef.current.rotation.y += 0.008 + (1 - animationProgress) * 0.02;
      meshRef.current.rotation.x += 0.003 + (1 - animationProgress) * 0.015;
    }

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime - initialTimeRef.current;
      const intensity = animationProgress;
      materialRef.current.uniforms.uGlow.value = intensity;
    }
  });

  return (
    <mesh ref={meshRef}>
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

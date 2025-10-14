"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import type { Mesh, ShaderMaterial } from "three"
import * as THREE from "three"

export function HueShiftingSphere() {
  const meshRef = useRef<Mesh>(null)
  const materialRef = useRef<ShaderMaterial>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.008
      meshRef.current.rotation.x += 0.003
    }

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

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
  `

  const fragmentShader = `
    uniform float uTime;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
    
    vec3 hueShift(vec3 color, float shift) {
      const vec3 k = vec3(0.57735, 0.57735, 0.57735);
      float cosAngle = cos(shift);
      return vec3(color * cosAngle + cross(k, color) * sin(shift) + k * dot(k, color) * (1.0 - cosAngle));
    }
    
    void main() {
      // Create gradient based on position
      float gradient = (vPosition.y + 1.0) * 0.5;
      
      // Base colors for gradient (pink to purple to blue)
      vec3 color1 = vec3(0.9, 0.2, 0.8); // Magenta/Pink
      vec3 color2 = vec3(0.5, 0.2, 0.9); // Purple
      vec3 color3 = vec3(0.2, 0.4, 1.0); // Blue
      
      // Mix colors based on gradient
      vec3 color;
      if (gradient > 0.5) {
        color = mix(color2, color1, (gradient - 0.5) * 2.0);
      } else {
        color = mix(color3, color2, gradient * 2.0);
      }
      
      float hueShiftAmount = sin(uTime * 0.8) * 0.6;
      color = hueShift(color, hueShiftAmount);
      
      vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
      vec3 normal = normalize(vNormal);
      
      // Key light from top-right
      vec3 keyLight = normalize(vec3(2.0, 3.0, 2.0));
      float keyDiffuse = max(dot(normal, keyLight), 0.0);
      float keySpecular = pow(max(dot(reflect(-keyLight, normal), viewDirection), 0.0), 32.0);
      
      // Fill light from left
      vec3 fillLight = normalize(vec3(-1.5, 0.5, 1.0));
      float fillDiffuse = max(dot(normal, fillLight), 0.0) * 0.4;
      
      // Rim light from behind
      vec3 rimLight = normalize(vec3(0.0, 0.5, -2.0));
      float rimDiffuse = max(dot(normal, rimLight), 0.0) * 0.3;
      
      // Combine lighting
      float totalLight = keyDiffuse + fillDiffuse + rimDiffuse + 0.3; // Added ambient
      color *= totalLight;
      color += keySpecular * 0.3; // Reduced specular from 0.8 to 0.3
      
      // Softened fresnel effect
      float fresnel = pow(1.0 - max(dot(viewDirection, normal), 0.0), 3.5);
      color += fresnel * 0.25; // Reduced from 0.5 to 0.25
      
      // Softened rim lighting
      float rim = 1.0 - max(dot(viewDirection, normal), 0.0);
      rim = pow(rim, 2.5);
      color += rim * vec3(0.4, 0.4, 0.7) * 0.3; // Reduced from 0.8 to 0.3
      
      gl_FragColor = vec4(color, 1.0);
    }
  `

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.5, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
        }}
        side={THREE.FrontSide}
      />
    </mesh>
  )
}

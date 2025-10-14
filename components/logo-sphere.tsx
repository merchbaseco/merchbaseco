"use client"

import { Canvas } from "@react-three/fiber"
import { Environment } from "@react-three/drei"
import { HueShiftingSphere } from "./hue-shifting-sphere"

export function LogoSphere() {
  return (
    <div className="w-16 h-16">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <color attach="background" args={["transparent"]} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <directionalLight position={[-10, -10, -5]} intensity={0.6} />
        <directionalLight position={[0, -10, 0]} intensity={0.4} />
        <HueShiftingSphere />
        <Environment preset="studio" />
      </Canvas>
    </div>
  )
}

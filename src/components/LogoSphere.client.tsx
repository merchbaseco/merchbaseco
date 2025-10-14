import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'

import { HueShiftingSphere } from '@/components/three/HueShiftingSphere'

export function LogoSphereClient() {
  return (
    <div className="h-16 w-16">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <color attach="background" args={['transparent']} />
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

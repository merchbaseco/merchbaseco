import { useEffect, useRef, useState } from "react";

import { HueShiftingSphere } from "@/components/three/HueShiftingSphere";
import { Squircle } from "@/components/ui/Squircle";
import { ContactShadows, Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import clsx from "clsx";

interface LogoProps {
  hoverTargetSelector?: string;
}

export function Logo({ hoverTargetSelector = "[data-logo-hover-target]" }: LogoProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [shadowStrength, setShadowStrength] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const shadowStrengthRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const hoverTarget = container.closest<HTMLElement>(hoverTargetSelector) ?? container;

    const handlePointerEnter = () => setIsHovered(true);
    const handlePointerLeave = () => setIsHovered(false);

    hoverTarget.addEventListener("pointerenter", handlePointerEnter);
    hoverTarget.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      hoverTarget.removeEventListener("pointerenter", handlePointerEnter);
      hoverTarget.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [hoverTargetSelector]);

  const handleLiftProgress = (value: number) => {
    const clamped = Math.min(Math.max(value, 0), 1);
    if (Math.abs(clamped - shadowStrengthRef.current) > 0.02 || clamped === 0 || clamped === 1) {
      shadowStrengthRef.current = clamped;
      setShadowStrength(clamped);
    } else {
      shadowStrengthRef.current = clamped;
    }
  };

  return (
    <div ref={containerRef} className="absolute inset-0 z-10">
      <Squircle
        cornerRadius={16}
        cornerSmoothing={0.8}
        className={clsx(
          "h-full w-full overflow-hidden rounded-2xl transition-transform duration-300 ease-out",
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{ alpha: true }}
          shadows
          className="h-full w-full"
          onPointerEnter={() => setIsHovered(true)}
          onPointerLeave={() => setIsHovered(false)}
          style={{ background: "transparent" }}
        >
          <color attach="background" args={["transparent"]} />
          <ambientLight intensity={0.8} />
          <directionalLight castShadow position={[10, 10, 5]} intensity={2} />
          <directionalLight castShadow position={[-10, -10, -5]} intensity={0.6} />
          <directionalLight castShadow position={[0, -10, 0]} intensity={0.4} />
          <HueShiftingSphere isHovered={isHovered} onLiftProgress={handleLiftProgress} />
          <ContactShadows
            position={[0, -1.6, 0]}
            opacity={0.1 * shadowStrength}
            scale={5.6}
            blur={4.2}
            far={2.2}
          />
          <Environment preset="studio" />
        </Canvas>
      </Squircle>
    </div>
  );
}

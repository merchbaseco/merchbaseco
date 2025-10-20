import { useEffect, useRef, useState } from "react";

import { HueShiftingSphere } from "@/components/three/HueShiftingSphere";
import { SquircleReact as Squircle } from "@/components/ui/squircle";
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
    const normalized = clamped <= 0.015 ? 0 : clamped;
    if (
      Math.abs(normalized - shadowStrengthRef.current) > 0.005 ||
      normalized === 0 ||
      normalized === 1
    ) {
      shadowStrengthRef.current = normalized;
      setShadowStrength(normalized);
    } else {
      shadowStrengthRef.current = normalized;
    }
  };

  return (
    <div ref={containerRef} className="absolute inset-0 z-10">
      <Squircle
        cornerRadius={16}
        cornerSmoothing={0.8}
        className={clsx(
          "h-full w-full overflow-hidden rounded-2xl transition-transform duration-300 ease-out",
          isHovered ? "scale-[1.04]" : "scale-100",
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
            position={[0, -1.32, 0]}
            opacity={0.18 * shadowStrength}
            scale={3.9}
            blur={3.4}
            far={2.8}
          />
          <Environment preset="studio" />
        </Canvas>
      </Squircle>
    </div>
  );
}

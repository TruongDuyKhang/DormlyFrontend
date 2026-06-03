"use client";

import { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";

export default function GlobeComponent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null);
  const animationRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const lastXRef = useRef(0);
  const lastYRef = useRef(0);
  const phiRef = useRef(0);
  const thetaRef = useRef(0.25);
  const autoRotateRef = useRef(true);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: 520,
      height: 520,
      phi: phiRef.current,
      theta: thetaRef.current,
      dark: 0,
      diffuse: 1.15,
      mapSamples: 40000,
      mapBrightness: 7,
      baseColor: [0.78, 0.7, 0.58],
      markerColor: [0.18, 0.16, 0.13],
      glowColor: [0.98, 0.91, 0.8],
      markers: [
        { location: [10.82, 106.63], size: 0.07 },
        { location: [21.02, 105.84], size: 0.055 },
        { location: [1.35, 103.87], size: 0.055 },
        { location: [35.68, 139.65], size: 0.05 },
        { location: [51.51, -0.13], size: 0.05 },
        { location: [37.78, -122.44], size: 0.05 },
      ],
      scale: 0.92,
      offset: [0, 0],
      opacity: 0.96,
    });

    globeRef.current = globe;

    const animate = () => {
      if (autoRotateRef.current && !isDraggingRef.current) {
        phiRef.current += 0.0023;
        globe.update({ phi: phiRef.current, theta: thetaRef.current });
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      globe.destroy();
      globeRef.current = null;
    };
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    autoRotateRef.current = false;
    setIsDragging(true);
    lastXRef.current = event.clientX;
    lastYRef.current = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;

    const deltaX = event.clientX - lastXRef.current;
    const deltaY = event.clientY - lastYRef.current;

    phiRef.current += deltaX * 0.005;
    thetaRef.current = Math.max(
      -Math.PI / 2.2,
      Math.min(Math.PI / 2.2, thetaRef.current + deltaY * 0.005)
    );

    globeRef.current?.update({ phi: phiRef.current, theta: thetaRef.current });

    lastXRef.current = event.clientX;
    lastYRef.current = event.clientY;
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = false;
    autoRotateRef.current = true;
    setIsDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return (
    <div className="relative flex size-full items-center justify-center">
      <div className="absolute inset-[8%] rounded-full bg-[#f7ead8] blur-3xl" />
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative z-10 aspect-square h-full max-h-[520px] w-full max-w-[520px]"
        style={{
          cursor: isDragging ? "grabbing" : "grab",
          touchAction: "none",
        }}
      />
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";

interface ImageComparisonProps {
  leftColor: string;
  rightColor: string;
}

export function ImageComparison({ leftColor, rightColor }: ImageComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setSliderPosition(percentage);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    handleMove(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Add global event listeners in case mouse leaves container while dragging
  useEffect(() => {
    const handleGlobalPointerUp = () => setIsDragging(false);
    const handleGlobalPointerMove = (e: PointerEvent) => {
      if (isDragging) handleMove(e.clientX);
    };

    if (isDragging) {
      window.addEventListener("pointerup", handleGlobalPointerUp);
      window.addEventListener("pointermove", handleGlobalPointerMove);
    }

    return () => {
      window.removeEventListener("pointerup", handleGlobalPointerUp);
      window.removeEventListener("pointermove", handleGlobalPointerMove);
    };
  }, [isDragging]);

  return (
    <div 
      ref={containerRef}
      className={`relative aspect-[4/3] rounded-3xl overflow-hidden border border-border/50 bg-card shadow-lg ${isDragging ? "cursor-grabbing" : "cursor-grab hover:shadow-xl"} transition-shadow duration-300`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{ touchAction: "none" }} // Prevent scrolling while dragging on mobile
    >
      <div className="absolute inset-0 flex select-none">
        {/* Left Side (Original) */}
        <div 
          className={`h-full border-r border-border/50 flex items-center justify-center relative overflow-hidden ${leftColor}`}
          style={{ width: `${sliderPosition}%` }}
        >
          <span className="text-[10px] font-semibold uppercase tracking-wider z-10 bg-background/80 px-3 py-1.5 rounded-full backdrop-blur-md absolute top-4 left-4 border border-border/50 pointer-events-none">Original</span>
        </div>
        
        {/* Right Side (Sketch) */}
        <div 
          className="h-full flex-1 flex items-center justify-center relative overflow-hidden bg-slate-900/40"
        >
          <span className="text-[10px] font-semibold uppercase tracking-wider z-10 bg-primary/20 text-primary border border-primary/30 px-3 py-1.5 rounded-full backdrop-blur-md absolute top-4 right-4 pointer-events-none">Sketch</span>
        </div>
      </div>
      
      {/* Slider Visuals */}
      <div 
        className="absolute inset-y-0 w-1 bg-gradient-to-b from-transparent via-primary/80 to-transparent -translate-x-1/2 pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background border-2 border-primary/50 shadow-xl flex items-center justify-center scale-100 hover:scale-110 transition-transform">
          <div className="w-1 h-3 bg-primary/70 rounded-full mx-0.5 pointer-events-none"></div>
          <div className="w-1 h-3 bg-primary/70 rounded-full mx-0.5 pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
}

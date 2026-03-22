"use client";

import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Line } from "react-konva";

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  tool: "pen" | "eraser";
  points: number[];
}

export function StepCanvas({ width = 600, height = 600 }) {
  const [lines, setLines] = useState<Stroke[]>([]);
  const isDrawing = useRef(false);

  // Handle SSR
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const handleMouseDown = (e: any) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { tool: "pen", points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing.current) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const newLines = [...lines];
    const lastLine = newLines[newLines.length - 1];
    
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);
    
    // replace last
    newLines.splice(newLines.length - 1, 1, lastLine);
    setLines(newLines);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  if (!isMounted) return <div className="w-full h-full bg-card/60 rounded-xl animate-pulse"></div>;

  return (
    <div className="w-full h-full w-full h-full min-h-[300px] overflow-hidden">
      <Stage
        width={width}
        height={height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        className="cursor-crosshair w-full h-full"
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={line.tool === "eraser" ? "#0A0F1C" : "#F8FAFC"}
              strokeWidth={line.tool === "eraser" ? 20 : 3}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}

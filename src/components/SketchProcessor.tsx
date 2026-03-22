"use client";

import { useEffect, useRef, useCallback } from "react";

export type SketchStyle = "pencil" | "pen";

interface SketchProcessorProps {
  imageSrc: string;
  style: SketchStyle;
  onProcessed: (images: string[]) => void;
}

const PAPER = 252;

function clamp255(n: number): number {
  return Math.max(0, Math.min(255, n));
}

/**
 * Four sketch stages from the photo: soft graphite / paper look (no harsh binary noise).
 * Uses difference-of-Gaussians style edges + dodge for the final pass.
 */
export function SketchProcessor({ imageSrc, style, onProcessed }: SketchProcessorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const processImage = useCallback(() => {
    if (!imageSrc || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const maxW = 640;
      const scale = Math.min(maxW / img.width, 1);
      const w = Math.floor(img.width * scale);
      const h = Math.floor(img.height * scale);
      canvas.width = w;
      canvas.height = h;

      ctx.drawImage(img, 0, 0, w, h);
      const imageData = ctx.getImageData(0, 0, w, h);
      const data = imageData.data;

      const gray = new Float32Array(w * h);
      for (let i = 0; i < w * h; i++) {
        const idx = i * 4;
        gray[i] = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
      }

      const results: string[] = [];

      for (let step = 1; step <= 4; step++) {
        const output = ctx.createImageData(w, h);
        const out = output.data;

        if (step <= 3) {
          const sigma = step === 1 ? 12 : step === 2 ? 6 : 2.5;
          const blurred = gaussianBlur(gray, w, h, sigma);
          const strength = step === 1 ? 2.2 : step === 2 ? 3.5 : 5.5;
          for (let i = 0; i < w * h; i++) {
            const edge = Math.abs(gray[i] - blurred[i]) * strength;
            let v: number;
            if (step === 1) {
              v = clamp255(PAPER - Math.min(edge * 1.4, 95));
            } else if (step === 2) {
              v = clamp255(PAPER - Math.min(edge * 1.8, 140));
            } else {
              v = clamp255(PAPER - Math.min(edge * 2.2, 185));
            }
            if (style === "pen" && step === 3) {
              v = v > 210 ? PAPER : v < 140 ? 35 : v;
            }
            const idx = i * 4;
            out[idx] = out[idx + 1] = out[idx + 2] = v;
            out[idx + 3] = 255;
          }
        } else {
          const inverted = new Float32Array(w * h);
          for (let i = 0; i < w * h; i++) inverted[i] = 255 - gray[i];
          const blurred = gaussianBlur(inverted, w, h, 2.2);
          for (let i = 0; i < w * h; i++) {
            let val = Math.min(255, (gray[i] * 255) / (255 - blurred[i] + 1));
            if (style === "pen") {
              val = val < 175 ? 0 : val < 220 ? 90 : PAPER;
            }
            val = clamp255(val);
            const idx = i * 4;
            out[idx] = out[idx + 1] = out[idx + 2] = val;
            out[idx + 3] = 255;
          }
        }

        ctx.putImageData(output, 0, 0);
        results.push(canvas.toDataURL("image/png"));
      }

      onProcessed(results);
    };
    img.src = imageSrc;
  }, [imageSrc, style, onProcessed]);

  useEffect(() => {
    processImage();
  }, [processImage]);

  return <canvas ref={canvasRef} className="hidden" />;
}

function gaussianBlur(input: Float32Array, w: number, h: number, sigma: number): Float32Array {
  const kernel = createGaussianKernel(sigma);
  const radius = Math.floor(kernel.length / 2);
  const temp = new Float32Array(w * h);
  const output = new Float32Array(w * h);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let sum = 0;
      let wSum = 0;
      for (let k = -radius; k <= radius; k++) {
        const xx = Math.min(w - 1, Math.max(0, x + k));
        sum += input[y * w + xx] * kernel[k + radius];
        wSum += kernel[k + radius];
      }
      temp[y * w + x] = sum / wSum;
    }
  }

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let sum = 0;
      let wSum = 0;
      for (let k = -radius; k <= radius; k++) {
        const yy = Math.min(h - 1, Math.max(0, y + k));
        sum += temp[yy * w + x] * kernel[k + radius];
        wSum += kernel[k + radius];
      }
      output[y * w + x] = sum / wSum;
    }
  }

  return output;
}

function createGaussianKernel(sigma: number): number[] {
  const size = Math.ceil(sigma * 3) * 2 + 1;
  const kernel = new Array(size);
  const center = Math.floor(size / 2);
  for (let i = 0; i < size; i++) {
    const x = i - center;
    kernel[i] = Math.exp(-(x * x) / (2 * sigma * sigma));
  }
  return kernel;
}

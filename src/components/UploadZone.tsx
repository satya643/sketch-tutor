"use client";

import { UploadCloud } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function UploadZone() {
  const [isDragging, setIsDragging] = useState(false);
  const router = useRouter();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Downscale if too large (max 1600px)
        const MAX_DIM = 1600;
        let w = img.width;
        let h = img.height;
        if (w > h && w > MAX_DIM) {
          h = (h * MAX_DIM) / w;
          w = MAX_DIM;
        } else if (h > MAX_DIM) {
          w = (w * MAX_DIM) / h;
          h = MAX_DIM;
        }

        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, 0, 0, w, h);

        // Compress to JPEG 0.8
        const compressed = canvas.toDataURL("image/jpeg", 0.8);
        try {
          localStorage.removeItem('uploadedImage'); // Clear old data first
          localStorage.setItem('uploadedImage', compressed);
          router.push("/workspace/custom");
        } catch (e) {
          console.error("Storage still failing even after compression", e);
          localStorage.clear(); // Extreme measure
          localStorage.setItem('uploadedImage', compressed);
          router.push("/workspace/custom");
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center w-full max-w-xl h-48 sm:h-56 border-2 border-dashed rounded-2xl transition-all duration-300 backdrop-blur-sm
        ${isDragging ? "border-primary bg-primary/10 scale-[1.02] shadow-2xl shadow-primary/20" : "border-border/60 bg-card/40 hover:border-primary/50 hover:bg-card/60 hover:shadow-xl"}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        onChange={handleChange}
        accept="image/png, image/jpeg, image/jpg, image/webp"
      />

      <div className="flex flex-col items-center justify-center p-6 text-center z-0">
        <div className="mb-4 rounded-full bg-primary/10 p-3 ring-1 ring-primary/20">
          <UploadCloud className="h-6 w-6 text-primary" />
        </div>
        <p className="mb-1.5 text-lg font-heading font-semibold tracking-tight text-foreground">
          Drop your reference image here
        </p>
        <p className="text-xs text-muted-foreground mb-4 text-balance pointer-events-none">
          We&apos;ll break it down into step-by-step sketching phases
        </p>
        <button className="px-5 py-2 bg-foreground text-background text-sm font-semibold rounded-xl shadow-lg pointer-events-none z-0">
          Upload Image
        </button>
      </div>
    </div>
  );
}

"use client";

import { BottomToolbar } from "@/components/BottomToolbar";
import { StepCanvas } from "@/components/StepCanvas";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, AlertCircle, Undo, Redo, Paintbrush2, ArrowLeft, ArrowRight, CheckCircle2, ChevronLeft, Eraser } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";

export default function StepViewPage({ params }: { params: Promise<{ id: string; stepId: string }> }) {
  const { id, stepId } = use(params);
  const currentStep = parseInt(stepId) || 1;
  const nextStep = currentStep < 7 ? currentStep + 1 : 7;
  const prevStep = currentStep > 1 ? currentStep - 1 : 1;

  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('uploadedImage');
    if (saved) setImageSrc(saved);
  }, []);

  return (
    <main className="flex h-[calc(100vh-4rem)] flex-col bg-background/95 relative">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-card/80 backdrop-blur-xl z-10">
        <Link href={`/workspace/${id}`} className="text-muted-foreground hover:text-foreground transition-colors p-2 -ml-2 rounded-xl hover:bg-muted/50">
           <ChevronLeft className="h-6 w-6" />
        </Link>
        <h1 className="font-heading text-lg font-semibold tracking-wide text-foreground flex items-center gap-3">
          Step {currentStep} of 7 <span className="text-muted-foreground font-normal">-</span> <span className="text-primary">{currentStep === 1 ? "Major Outlines" : currentStep === 2 ? "Refining Shapes" : "Adding Details"}</span>
        </h1>
        <div className="flex gap-2">
           <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-muted-foreground"><Paintbrush2 className="h-4 w-4" /></Button>
           <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-muted-foreground"><CheckCircle2 className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden p-0">
        <div className="flex-1 relative bg-[#0F1423]">
          <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none opacity-20 z-0">
             <div className="border-r border-b border-primary/40"></div>
             <div className="border-r border-b border-primary/40"></div>
             <div className="border-r border-b border-primary/40"></div>
             <div className="border-b border-primary/40"></div>
             <div className="border-r border-b border-primary/40"></div>
             <div className="border-r border-b border-primary/40"></div>
             <div className="border-r border-b border-primary/40"></div>
             <div className="border-b border-primary/40"></div>
             <div className="border-r border-b border-primary/40"></div>
             <div className="border-r border-b border-primary/40"></div>
             <div className="border-r border-b border-primary/40"></div>
             <div className="border-b border-primary/40"></div>
             <div className="border-r border-primary/40"></div>
             <div className="border-r border-primary/40"></div>
             <div className="border-r border-primary/40"></div>
             <div></div>
          </div>
          
          <div className="absolute inset-0 z-10 opacity-70">
             <StepCanvas width={1200} height={800} />
          </div>

          <div className="absolute top-6 left-6 w-80 flex flex-col gap-4 z-20 hidden md:flex">
             <div className="bg-card/90 backdrop-blur-xl border border-border/80 rounded-3xl p-4 shadow-2xl flex flex-col gap-4">
                <div className="flex justify-between items-center px-1">
                   <h3 className="font-heading font-semibold text-sm">Reference</h3>
                   <span className="text-xs font-semibold uppercase text-primary tracking-widest">Zoom</span>
                </div>
                <div 
                  className="aspect-[3/4] rounded-2xl bg-zinc-800 relative overflow-hidden ring-1 ring-white/10 bg-cover bg-center"
                  style={{ backgroundImage: imageSrc ? `url(${imageSrc})` : 'none' }}
                >
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 flex items-end p-4">
                     <p className="text-xs font-medium text-white/90 pb-1">Focus on negative space here</p>
                   </div>
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 border border-white rounded-full bg-white/20 shadow-[0_0_15px_rgba(255,255,255,0.5)]"></div>
                </div>
                <div className="flex items-center gap-2 px-1 text-muted-foreground">
                   <ZoomOut className="h-4 w-4" />
                   <div className="h-1 flex-1 bg-muted rounded-full overflow-hidden">
                     <div className="w-1/3 h-full bg-primary rounded-full"></div>
                   </div>
                   <ZoomIn className="h-4 w-4" />
                </div>
             </div>
          </div>

          <div className="absolute top-6 right-6 w-80 flex flex-col gap-4 z-20 hidden lg:flex">
             <div className="bg-card/90 backdrop-blur-xl border border-border/80 rounded-3xl p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-heading font-bold text-lg">Details</h3>
                <div className="flex gap-1 text-muted-foreground">
                  <Button variant="ghost" size="icon" className="h-6 w-6"><ChevronLeft className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6"><ChevronLeft className="h-4 w-4 rotate-180" /></Button>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex gap-3 items-start group">
                  <span className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold transition-colors">1</span>
                  <span className="text-sm font-medium leading-relaxed transition-colors">Sketch the eyes first</span>
                </li>
                <li className="flex gap-3 items-start group">
                  <span className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-muted text-muted-foreground text-xs font-bold transition-colors">2</span>
                  <span className="text-sm text-muted-foreground/90 leading-relaxed transition-colors text-balance">Use light strokes for the nose bridge</span>
                </li>
              </ul>

              <div className="bg-[#2A1515] border border-red-900/50 rounded-2xl p-4 flex gap-3 text-red-200 shadow-inner">
                <AlertCircle className="shrink-0 h-5 w-5 text-red-500" />
                <p className="text-sm font-medium leading-snug">Avoid making the nose too long</p>
              </div>
              
              <div className="mt-8 grid grid-cols-2 gap-3">
                 <Button variant="outline" className="h-12 border-border/80 bg-background/50 text-foreground hover:bg-muted font-medium rounded-xl gap-2"><Undo className="h-4 w-4" /> Undo</Button>
                 <Button variant="outline" className="h-12 border-border/80 bg-background/50 text-foreground hover:bg-muted font-medium rounded-xl gap-2"><Redo className="h-4 w-4" /> Redo</Button>
                 <Button variant="secondary" className="h-12 col-span-2 rounded-xl text-secondary-foreground font-semibold gap-2 shadow-sm"><Eraser className="h-4 w-4" /> Eraser Mode</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 z-30">
        <Link href={`/workspace/${id}/step/${prevStep}`}>
          <Button variant="secondary" size="lg" className="h-14 rounded-2xl px-8 font-semibold shadow-xl border border-border/50 text-foreground hover:bg-muted/80 backdrop-blur-md">
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous Step
          </Button>
        </Link>
        <Link href={`/workspace/${id}/step/${nextStep}`}>
          <Button size="lg" className="h-14 rounded-2xl px-10 font-bold bg-primary text-white hover:bg-primary/90 shadow-xl shadow-primary/25 border border-primary/20">
            Next Step <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
        <Button variant="outline" size="lg" className="h-14 rounded-2xl px-8 font-semibold shadow-xl border border-border/80 bg-card/90 text-foreground hover:bg-muted backdrop-blur-md">
          Mark Complete
        </Button>
      </div>
    </main>
  );
}

"use client";

import { UploadZone } from "@/components/UploadZone";
import { Button } from "@/components/ui/button";
import { User, Activity, SunMedium, Play } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const [analyzing, setAnalyzing] = useState(true);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          setAnalyzing(false);
          return 100;
        }
        return p + 2;
      });
    }, 50);
    return () => clearInterval(timer);
  }, []);

  const handleStart = () => {
    // Navigate to workspace with a fake id
    router.push("/workspace/123");
  };

  return (
    <main className="container mx-auto max-w-7xl px-4 py-12 flex-1 flex flex-col">
      <h1 className="text-3xl font-heading font-bold text-center mb-12">Upload & Analyze</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start flex-1 min-h-[600px]">
        {/* Left: Upload Zone container */}
        <div className="h-full flex flex-col bg-card/20 rounded-3xl pt-0 border border-transparent">
          <UploadZone />
        </div>

        {/* Right: Analysis Panel */}
        <div className="rounded-3xl border border-border/60 bg-card/80 p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden min-h-[500px] flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-xl font-heading font-semibold tracking-tight">Instant Preview</h2>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full bg-muted/50 hover:bg-muted">✕</Button>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center">
            {/* Preview Image dummy */}
            <div className="w-48 h-48 rounded-3xl bg-muted/20 border border-border/50 flex items-center justify-center mb-10 mx-auto shadow-inner relative overflow-hidden group">
               <User className="h-20 w-20 text-muted-foreground/30 transition-transform group-hover:scale-110" />
               {analyzing && (
                 <div className="absolute inset-0 bg-primary/10 animate-pulse backdrop-blur-[1px]"></div>
               )}
            </div>

            {/* Analysis Tags */}
            <div className={`flex flex-wrap justify-center gap-3 mb-10 transition-opacity duration-700 ${analyzing ? 'opacity-0' : 'opacity-100'}`}>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary px-4 py-2 rounded-full border border-primary/20">
                <User className="h-3.5 w-3.5" /> Face detected
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-500 px-4 py-2 rounded-full border border-amber-500/20">
                <Activity className="h-3.5 w-3.5" /> Medium difficulty
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider bg-yellow-500/10 text-yellow-500 px-4 py-2 rounded-full border border-yellow-500/20">
                <SunMedium className="h-3.5 w-3.5" /> Light from left
              </div>
            </div>

            {/* Mode Chips */}
            <div className={`grid grid-cols-2 gap-3 w-full max-w-sm mb-auto transition-all duration-700 delay-100 ${analyzing ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
              <Button variant="outline" className="border-primary/50 bg-primary/5 text-primary hover:bg-primary/10 h-14 rounded-2xl font-semibold shadow-sm shadow-primary/10">Beginner Mode</Button>
              <Button variant="outline" className="h-14 rounded-2xl border-border/60 hover:bg-muted/50 font-medium text-muted-foreground hover:text-foreground">Exact Clone</Button>
              <Button variant="outline" className="h-14 rounded-2xl border-border/60 hover:bg-muted/50 font-medium text-muted-foreground hover:text-foreground">Outline Only</Button>
              <Button variant="outline" className="h-14 rounded-2xl border-border/60 hover:bg-muted/50 font-medium text-muted-foreground hover:text-foreground">Add Shading</Button>
            </div>

            {/* Action Area */}
            <div className="w-full mt-12 bg-background/50 p-6 rounded-3xl border border-border/30">
              {analyzing ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-medium text-muted-foreground animate-pulse">Analyzing image layers...</span>
                    <span className="text-2xl font-heading font-bold text-primary">{progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-150 ease-out" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <Button onClick={handleStart} className="w-full h-16 text-lg font-bold rounded-2xl bg-primary text-white hover:bg-primary/90 shadow-xl shadow-primary/25 transition-all outline outline-offset-2 outline-transparent hover:outline-primary/20 group">
                  <Play className="h-5 w-5 mr-3 fill-current group-hover:scale-110 transition-transform" /> Start Sketching
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

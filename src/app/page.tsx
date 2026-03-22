import { UploadZone } from "@/components/UploadZone";
import { Layers, Eye, Pencil, Sparkles, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center px-4 overflow-x-hidden">
      {/* Hero Section */}
      <div className="text-center max-w-2xl mt-12 sm:mt-16 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4">
          <Sparkles className="h-3 w-3" /> AI-Powered Sketch Tutor
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold tracking-tight mb-4 text-foreground text-balance leading-tight">
          Learn to Draw Any Photo <span className="text-primary">Step by Step</span>
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mb-6 text-balance max-w-lg mx-auto">
          Upload a photo and our AI breaks it down into progressive sketching phases — from basic shapes to full shading. Like having a real art teacher by your side.
        </p>
      </div>

      <UploadZone />

      {/* How It Works Section */}
      <div id="how-it-works" className="mt-20 sm:mt-24 w-full max-w-4xl">
        <h2 className="text-xl sm:text-2xl font-heading font-semibold text-center mb-3">How It Works</h2>
        <p className="text-sm text-muted-foreground text-center mb-10 max-w-md mx-auto">
          Just like a real artist learns — skeleton first, then details, then shading.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { icon: Layers, title: "Basic Shapes", desc: "Draw the outline & skeleton", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
            { icon: Eye, title: "Place Features", desc: "Position eyes, nose, lips", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
            { icon: Pencil, title: "Refine Details", desc: "Shape each feature precisely", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
            { icon: Sparkles, title: "Add Shading", desc: "Shadows, highlights & depth", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
          ].map((step, i) => (
            <div key={i} className={`flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl border ${step.bg} transition-transform hover:-translate-y-1`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${step.bg}`}>
                <step.icon className={`h-5 w-5 ${step.color}`} />
              </div>
              <div className="text-xs font-bold text-foreground mb-1">{step.title}</div>
              <div className="text-[10px] text-muted-foreground leading-tight">{step.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Transformations Section */}
      <div className="mt-20 sm:mt-24 w-full max-w-5xl pb-16">
        <div className="flex flex-col items-center mb-12 text-center">
          <div className="h-px w-12 bg-primary/30 mb-6" />
          <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-3">AI Sketch Breakdown</h2>
          <p className="text-sm text-muted-foreground max-w-md">
            Watch how our AI decomposes complex subjects into teachable artistic phases.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Example 1: Face */}
          <div className="group bg-card/30 rounded-3xl border border-border/40 p-6 transition-all hover:border-primary/30 hover:bg-card/50">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Study 01: Portrait</span>
              <Sparkles className="h-3 w-3 text-primary opacity-50" />
            </div>
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Reference photo
                </p>
                <div className="flex min-h-[120px] items-center justify-center rounded-2xl border border-white/5 bg-black p-2 sm:p-3 shadow-inner">
                  <img
                    src="/tutorials/study01-reference.png"
                    alt="Reference portrait: cinematic framing, green eyes, soft lighting"
                    className="h-auto max-h-[min(32vh,240px)] w-full object-contain"
                  />
                </div>
              </div>
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Four-step breakdown
                </p>
                <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-white/5 bg-white p-2 sm:p-3 shadow-inner">
                  <img
                    src="/tutorials/study01-tutorial.png"
                    alt="Portrait study: geometry, features, line art, and shading in four panels"
                    className="h-auto max-h-[min(65vh,560px)] w-full object-contain"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6">
              <h4 className="text-sm font-bold mb-2 text-foreground">Proportional Mastery</h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Start from your own reference, then follow the same path — construction, features, clean lines, and full shading — while keeping likeness and lighting in mind.
              </p>
            </div>
          </div>

          {/* Example 2: Figure */}
          <div className="group bg-card/30 rounded-3xl border border-border/40 p-6 transition-all hover:border-primary/30 hover:bg-card/50">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Study 02: Figure</span>
              <Sparkles className="h-3 w-3 text-primary opacity-50" />
            </div>
            <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-white/5 bg-white p-2 sm:p-3 shadow-inner">
              <img
                src="/tutorials/figure.png"
                alt="Figure breakdown: four stages, full sheet visible"
                className="h-auto max-h-[min(65vh,560px)] w-full object-contain"
              />
            </div>
            <div className="mt-6">
              <h4 className="text-sm font-bold mb-2 text-foreground">Dynamic Gesture</h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">Analyze weight, balance, and action lines before refining the form and adding dramatic charcoal textures.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto w-full border-t border-border/30 py-8 text-center text-xs text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} SketchTutor AI. All rights reserved.</p>
      </footer>
    </main>
  );
}

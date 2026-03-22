"use client";

import { AIChat } from "@/components/AIChat";
import { SketchProcessor, SketchStyle } from "@/components/SketchProcessor";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Layers,
  Eye,
  Pencil,
  Sparkles,
  Loader2,
  LayoutGrid,
  Undo2,
  ImageIcon,
  X,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";

type SketchProviders = { openai: boolean };

const STEPS = [
  { id: 1, title: "Gesture & Skeleton", subtitle: "Action line, proportions, landmarks", icon: Layers, color: "text-blue-400", borderColor: "border-blue-500", bgColor: "bg-blue-500/10" },
  { id: 2, title: "Blocking Forms", subtitle: "Primitive volumes & major planes", icon: Eye, color: "text-emerald-400", borderColor: "border-emerald-500", bgColor: "bg-emerald-500/10" },
  { id: 3, title: "Line Art & Details", subtitle: "Contour hierarchy & feature accuracy", icon: Pencil, color: "text-amber-400", borderColor: "border-amber-500", bgColor: "bg-amber-500/10" },
  { id: 4, title: "Charcoal & Shading", subtitle: "Value design & light logic", icon: Sparkles, color: "text-purple-400", borderColor: "border-purple-500", bgColor: "bg-purple-500/10" },
];

const DESCRIPTIONS = [
  "Stage 1 — Gesture and armature: establish the axis of action and largest proportional relationships before any surface detail. For the head, indicate cranial mass, facial angle, and eye line with light, reversible marks; for the figure, prioritize rhythm of the spine and weight-bearing structure over contour.",
  "Stage 2 — Structural block-in: translate linear scaffolding into simple solids (boxes, cylinders, wedges) that respect perspective overlap and major plane changes. Resolve torso, pelvis, and limb volumes as interlocking masses so later detail sits on believable geometry.",
  "Stage 3 — Line quality and specificity: refine contours with deliberate weight variation (search vs. finish lines), clarify hard and soft transitions, and lock accurate shapes for features, hair masses, and silhouette. Maintain structural truth from Stages 1–2 while increasing descriptive precision.",
  "Stage 4 — Value and rendering: commit to a clear light key—terminator, core shadow, reflected light, occlusion, and cast shadow families. Build halftones and highlights in controlled passes so form reads in space; reserve extremes for focal areas and design readability across the whole image.",
];

export default function WorkspacePage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [sketchImages, setSketchImages] = useState<string[]>([]);
  const [baseSteps, setBaseSteps] = useState<string[]>([]);
  const [activeStep, setActiveStep] = useState(3);
  const [sketchStyle, setSketchStyle] = useState<SketchStyle>("pencil");
  const [isProcessing, setIsProcessing] = useState(false);
  const [providers, setProviders] = useState<SketchProviders>({ openai: false });
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [tutorialApplied, setTutorialApplied] = useState(false);
  const [tutorialStripUrl, setTutorialStripUrl] = useState<string | null>(null);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [referenceOverlayOpen, setReferenceOverlayOpen] = useState(false);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  /** Full strip visible vs zoomed to one stage (avoids cropping the wide tutorial). */
  const [tutorialShowFullStrip, setTutorialShowFullStrip] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("uploadedImage");
    if (saved) {
      setImageSrc(saved);
      setIsProcessing(true);
    }
  }, []);

  useEffect(() => {
    fetch("/api/sketch-ai")
      .then((r) => r.json())
      .then((d: { providers?: Partial<SketchProviders> }) =>
        setProviders({ openai: Boolean(d.providers?.openai) })
      )
      .catch(() => setProviders({ openai: false }));
  }, []);

  const handleProcessed = useCallback((images: string[]) => {
    setBaseSteps(images);
    setSketchImages(images);
    setIsProcessing(false);
    setTutorialApplied(false);
    setTutorialStripUrl(null);
    setAiError(null);
  }, []);

  const handleStyleChange = (style: SketchStyle) => {
    setSketchStyle(style);
    setIsProcessing(true);
    setSketchImages([]);
    setBaseSteps([]);
    setTutorialApplied(false);
    setTutorialStripUrl(null);
    setAiError(null);
  };

  const applyOpenAiTutorial = async () => {
    if (!imageSrc || sketchImages.length < 4) return;
    setAiLoading(true);
    setAiError(null);
    try {
      const res = await fetch("/api/sketch-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: imageSrc, mode: "openai_tutorial" }),
      });
      const data = (await res.json()) as { error?: string; stripBase64?: string };
      if (!res.ok) {
        throw new Error(data.error || "Request failed");
      }
      if (!data.stripBase64) {
        throw new Error("No tutorial strip in response");
      }
      setTutorialStripUrl(data.stripBase64);
      setTutorialApplied(true);
      setTutorialShowFullStrip(true);
    } catch (e) {
      setAiError(e instanceof Error ? e.message : "Failed");
    } finally {
      setAiLoading(false);
    }
  };

  const revertTutorial = () => {
    setTutorialStripUrl(null);
    setTutorialApplied(false);
    setSketchImages(baseSteps);
    setAiError(null);
  };

  const step = STEPS[activeStep];
  const StepIcon = step.icon;

  return (
    <>
      <main className="fixed inset-0 top-14 flex overflow-hidden bg-background font-sans z-0">
        {imageSrc && sketchImages.length === 0 && (
          <SketchProcessor imageSrc={imageSrc} style={sketchStyle} onProcessed={handleProcessed} />
        )}

        <aside className="w-[300px] border-r border-border/40 flex flex-col bg-card/5 shrink-0 h-full overflow-hidden hidden md:flex">
          <AIChat 
            originalImage={imageSrc} 
            stageImage={sketchImages[activeStep]} 
            stageName={step?.title} 
          />
        </aside>

        <section className="flex-1 flex flex-col min-w-0 h-full bg-[#0a0c10] overflow-hidden">
          <header className="flex min-h-12 shrink-0 flex-wrap items-center justify-between gap-2 border-b border-border/40 bg-card/10 px-4 py-2 sm:px-6 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <h1 className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Studio</h1>
              <div className="h-4 w-[1px] bg-border/40" />
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium text-muted-foreground uppercase">Style:</span>
                <div className="flex bg-muted/30 p-0.5 rounded-lg border border-border/20">
                  <button
                    type="button"
                    onClick={() => handleStyleChange("pencil")}
                    className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${sketchStyle === "pencil" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    Pencil
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStyleChange("pen")}
                    className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${sketchStyle === "pen" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    Pen
                  </button>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 border-emerald-500/30 bg-emerald-500/5 text-[10px] font-bold uppercase tracking-wide ml-2"
                disabled={isProcessing || sketchImages.length < 4 || aiLoading}
                title={
                  providers.openai
                    ? "Study-style 4-panel sheet from your photo (OpenAI API usage is charged to your account)"
                    : "OPENAI_API_KEY missing on server — add to .env.local and restart dev"
                }
                onClick={applyOpenAiTutorial}
              >
                {aiLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LayoutGrid className="h-3.5 w-3.5" />}
                AI Tutorial
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {tutorialApplied && (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-[10px] font-bold uppercase tracking-wide border-white/20"
                    onClick={() => setTutorialShowFullStrip((v) => !v)}
                  >
                    {tutorialShowFullStrip ? "Focus step" : "Full sheet"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground"
                    onClick={revertTutorial}
                  >
                    <Undo2 className="h-3.5 w-3.5" />
                    Local preview
                  </Button>
                </>
              )}
            </div>
          </header>

          {aiError && (
            <div className="border-b border-destructive/25 bg-destructive/10 px-4 py-2">
              <p className="text-[10px] font-medium text-destructive leading-relaxed max-w-4xl mx-auto">{aiError}</p>
            </div>
          )}

          {!providers.openai && !isProcessing && sketchImages.length >= 4 && (
            <div className="border-b border-amber-500/25 bg-amber-500/10 px-4 py-1.5 text-center">
              <p className="text-[10px] text-amber-200/90 leading-relaxed">
                <span className="font-semibold text-amber-100">AI Tutorial</span> needs an OpenAI key on the server. Add{" "}
                <code className="text-[9px]">OPENAI_API_KEY</code> to <code className="text-[9px]">.env.local</code>, then restart{" "}
                <code className="text-[9px]">npm run dev</code>.
              </p>
            </div>
          )}

          {!isProcessing && !tutorialStripUrl && sketchImages.length >= 4 && (
            <div className="border-b border-border/30 bg-muted/20 px-4 py-1.5 text-center">
              <p className="text-[10px] text-muted-foreground leading-relaxed w-full">
                4-step preview. Click <span className="font-semibold text-emerald-400">AI Tutorial</span> for pro study sheets.
              </p>
            </div>
          )}

          <div className="flex-1 relative min-h-0 flex flex-col p-0 overflow-auto select-none">
            <div className="md:hidden absolute top-3 right-3 z-20 flex flex-col items-end gap-1.5">
              {imageSrc && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="h-8 gap-1.5 text-[10px] font-bold uppercase shadow-lg bg-background/80 backdrop-blur-md"
                  onClick={() => setReferenceOverlayOpen(true)}
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                  Reference
                </Button>
              )}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="h-8 gap-1.5 text-[10px] font-bold uppercase shadow-lg bg-background/80 backdrop-blur-md"
                onClick={() => setMobileChatOpen(true)}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                Chat
              </Button>
            </div>
            {isProcessing ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-[9px] font-bold text-muted-foreground tracking-widest uppercase">Processing Artwork...</p>
              </div>
            ) : tutorialStripUrl ? (
              <div className="relative flex flex-1 flex-col items-center justify-center gap-2 p-3 sm:p-4 animate-in fade-in duration-300 min-h-0">
                <div className="pointer-events-none absolute top-2 left-3 z-10 bg-emerald-500/20 backdrop-blur-md text-[8px] font-black text-emerald-200 px-2 py-0.5 rounded border border-emerald-500/30 tracking-widest uppercase">
                  From your photo · OpenAI
                </div>
                {tutorialShowFullStrip ? (
                  <div className="flex w-full flex-1 min-h-0 flex-col items-center gap-2 p-2 sm:p-4">
                    <div className="flex-1 min-h-0 w-full flex items-center justify-center relative overflow-x-auto scrollbar-hide">
                      <img
                        src={tutorialStripUrl}
                        alt="Full four-stage pencil tutorial sheet"
                        className="block h-auto max-h-full w-auto max-w-none min-w-0 object-contain cursor-zoom-in"
                        onClick={() => setZoomImage(tutorialStripUrl)}
                      />
                    </div>
                    <p className="text-[9px] font-medium text-muted-foreground/90 text-center w-full px-2 shrink-0">
                      Full sheet is shown without cropping; on narrow screens scroll horizontally if needed. The footer stage index matches panel {activeStep + 1}. Use{" "}
                      <span className="text-foreground/80">Focus step</span> for one panel at a time.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="relative w-full max-w-[min(96vw,1100px)] shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white shadow-2xl">
                      <img
                        src={tutorialStripUrl}
                        alt={`Tutorial — stage ${activeStep + 1}`}
                        className="block h-auto max-h-[min(78vh,800px)] w-[400%] max-w-none transition-transform duration-300 ease-out"
                        style={{ transform: `translateX(-${activeStep * 25}%)` }}
                      />
                    </div>
                    <p className="text-[9px] font-medium text-muted-foreground/90 text-center max-w-md px-2">
                      Panel {activeStep + 1} of 4 — footer controls advance the horizontal crop of the generated strip.
                    </p>
                  </>
                )}
              </div>
            ) : sketchImages[activeStep] ? (
              <div className="flex flex-1 min-h-0 w-full flex-col items-center gap-1.5 p-2 sm:px-6 sm:py-3 animate-in fade-in zoom-in-95 duration-500">
                <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground shrink-0">
                  Stage {activeStep + 1} · {step.title}
                </span>
                <div className="flex-1 min-h-0 w-full flex items-center justify-center relative">
                  <img
                    src={sketchImages[activeStep]}
                    alt={`Stage ${step.id}: ${step.title}`}
                    className="max-h-full max-w-full object-contain rounded-lg border border-white/5 bg-white shadow-2xl cursor-zoom-in"
                    onClick={() => setZoomImage(sketchImages[activeStep])}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-1 items-center justify-center px-4 text-center text-muted-foreground text-[10px] font-medium tracking-wide">
                Upload a reference from the home page to load the four-stage pipeline.
              </div>
            )}
          </div>

          <footer className="shrink-0 border-t border-border/20 bg-card/30 backdrop-blur-xl px-4 py-2 sm:py-3 cursor-default">
            <div className="w-full flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2 shrink-0">
                  <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 ${step.bgColor} ${step.borderColor}`}>
                    <StepIcon className={`h-2.5 w-2.5 ${step.color}`} />
                  </div>
                  <h1 className="text-[10px] sm:text-xs font-black tracking-tight uppercase text-foreground">Stage {step.id}: {step.title}</h1>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-full border border-white/10 shrink-0 overflow-x-auto scrollbar-hide">
                    {STEPS.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActiveStep(i)}
                        className={`transition-all duration-300 shrink-0 ${i === activeStep ? "h-1 w-5 bg-primary rounded-full" : "h-1 w-1.2 bg-border/40 rounded-full hover:bg-border"}`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-2.5 border-border/40 hover:bg-white/5"
                      disabled={activeStep === 0}
                      onClick={() => setActiveStep((p) => Math.max(0, p - 1))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-2.5 border-border/40 hover:bg-white/5 text-primary"
                      disabled={activeStep === STEPS.length - 1}
                      onClick={() => setActiveStep((p) => Math.min(STEPS.length - 1, p + 1))}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </section>

        <aside className="hidden h-full w-[260px] shrink-0 flex-col border-l border-border/40 bg-card/10 backdrop-blur-sm md:flex lg:w-[280px] overflow-hidden">
          <div className="shrink-0 border-b border-border/30 bg-muted/5 px-3 py-2">
            <h3 className="text-center text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">Your reference</h3>
          </div>
          <div className="shrink-0 border-b border-border/20 p-2">
            {imageSrc ? (
              <div className="flex max-h-[min(32vh,280px)] items-center justify-center rounded-lg border border-white/10 bg-black/30">
                <img
                  src={imageSrc}
                  alt="Your uploaded reference"
                  className="max-h-[min(32vh,280px)] w-full object-contain"
                />
              </div>
            ) : (
              <p className="py-6 text-center text-[9px] text-muted-foreground">No upload</p>
            )}
          </div>
        </aside>


      </main>

      {zoomImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 p-4 md:p-8"
          onClick={() => setZoomImage(null)}
        >
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute top-6 right-6 h-10 w-10 rounded-full z-[100000]"
            onClick={() => setZoomImage(null)}
          >
            <X className="h-5 w-5" />
          </Button>
          <img
            src={zoomImage}
            alt="Zoomed artwork"
            className="h-full w-full object-contain animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {mobileChatOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[99999] flex flex-col bg-background md:hidden"
        >
          <header className="flex h-14 items-center justify-between border-b px-4 shrink-0">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">AI Tutor Chat</h2>
            <Button variant="ghost" size="icon" onClick={() => setMobileChatOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </header>
          <div className="flex-1 overflow-hidden">
            <AIChat 
              originalImage={imageSrc} 
              stageImage={sketchImages[activeStep]} 
              stageName={step?.title} 
            />
          </div>
        </div>
      )}

      {referenceOverlayOpen && imageSrc && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Your reference photo"
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/85 p-4"
          onClick={() => setReferenceOverlayOpen(false)}
        >
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute top-6 right-6 h-9 w-9 rounded-full"
            onClick={() => setReferenceOverlayOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          <img
            src={imageSrc}
            alt="Your reference upload"
            className="max-h-[min(88vh,800px)] max-w-full object-contain rounded-xl border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

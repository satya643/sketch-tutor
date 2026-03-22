import { Button } from "@/components/ui/button";
import { PenTool, Pencil, Eraser, ArrowRight, MousePointer2 } from "lucide-react";

export function BottomToolbar() {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between gap-4 rounded-2xl border border-border/60 bg-card/80 p-2 px-4 shadow-2xl backdrop-blur-xl max-w-[95vw] md:max-w-max w-full">
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {/* Tools */}
        <Button variant="ghost" className="flex flex-col h-[60px] w-[60px] gap-1.5 text-primary bg-primary/10 rounded-xl hover:bg-primary/20 hover:text-primary">
          <Pencil className="h-5 w-5" />
          <span className="text-[10px] font-medium tracking-tight">Pencil</span>
        </Button>
        <Button variant="ghost" className="flex flex-col h-[60px] w-[60px] gap-1.5 text-muted-foreground hover:bg-muted/50 hover:text-foreground rounded-xl">
          <Pencil className="h-5 w-5 opacity-70" />
          <span className="text-[10px] font-medium tracking-tight">HB</span>
        </Button>
        <Button variant="ghost" className="flex flex-col h-[60px] w-[60px] gap-1.5 text-muted-foreground hover:bg-muted/50 hover:text-foreground rounded-xl">
          <Pencil className="h-5 w-5 opacity-80" />
          <span className="text-[10px] font-medium tracking-tight">2B</span>
        </Button>
        <Button variant="ghost" className="flex flex-col h-[60px] w-[60px] gap-1.5 text-muted-foreground hover:bg-muted/50 hover:text-foreground rounded-xl">
          <PenTool className="h-5 w-5" />
          <span className="text-[10px] font-medium tracking-tight">Pen</span>
        </Button>
        <Button variant="ghost" className="flex flex-col h-[60px] w-[60px] gap-1.5 text-muted-foreground hover:bg-muted/50 hover:text-foreground rounded-xl">
          <Pencil className="h-5 w-5 text-zinc-400" />
          <span className="text-[10px] font-medium tracking-tight">Charcoal</span>
        </Button>
        <Button variant="ghost" className="flex flex-col h-[60px] w-[60px] gap-1.5 text-muted-foreground hover:bg-muted/50 hover:text-foreground rounded-xl">
          <Eraser className="h-5 w-5" />
          <span className="text-[10px] font-medium tracking-tight">Eraser</span>
        </Button>
      </div>

      <div className="hidden h-10 w-[1px] bg-border md:block mx-1"></div>

      <div className="hidden flex-wrap items-center gap-2 md:flex">
        <Button variant="outline" size="sm" className="h-9 rounded-full px-5 border-primary/50 text-foreground bg-primary/10 hover:bg-primary/20 transition-all font-medium">Beginner</Button>
        <Button variant="ghost" size="sm" className="h-9 rounded-full px-5 text-muted-foreground hover:text-foreground font-medium">Intermediate</Button>
        <Button variant="ghost" size="sm" className="h-9 rounded-full px-5 text-muted-foreground hover:text-foreground font-medium">Pro Clone</Button>
      </div>

      <div className="hidden h-10 w-[1px] bg-border sm:block mx-1"></div>

      <Button className="h-[60px] px-6 rounded-xl shrink-0 bg-primary text-white hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 font-semibold tracking-wide">
        Next Step <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
}

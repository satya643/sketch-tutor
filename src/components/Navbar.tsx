import Link from "next/link";
import { PencilLine } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4 md:px-8">
        <div className="flex flex-1 items-center justify-between">

          <Link href="/" className="flex items-center space-x-2">
            <div className="rounded-full bg-primary/10 p-1">
              <PencilLine className="h-4 w-4 text-primary" />
            </div>
            <span className="font-heading text-lg font-bold tracking-tight">
              SketchTutor
            </span>
          </Link>

          <nav className="flex items-center space-x-4 text-[13px] sm:text-sm font-medium">
            <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground/90">Home</Link>
            <Link href="/#how-it-works" className="transition-colors hover:text-foreground/80 text-foreground/60 hidden sm:block">How it Works</Link>
          </nav>

          <Link href="/login" className="flex">
            <Button variant="ghost" size="sm" className="font-medium text-muted-foreground hover:text-foreground">Login</Button>
          </Link>

        </div>
      </div>
    </nav>
  );
}

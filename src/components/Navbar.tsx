"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PencilLine, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [activeHash, setActiveHash] = useState("");

  useEffect(() => {
    // Set initial hash
    setActiveHash(window.location.hash);

    const handleHashChange = () => {
      setActiveHash(window.location.hash);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const isHomeActive = pathname === "/" && activeHash === "";
  const isHowItWorksActive = pathname === "/" && activeHash === "#how-it-works";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-8">
        <div className="flex flex-1 items-center justify-between">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 p-2 ring-1 ring-primary/20 transition-all duration-300 group-hover:ring-primary/40 group-hover:bg-primary/20 group-hover:shadow-[0_0_15px_hsl(var(--primary)/20%)]">
              <PencilLine className="h-4 w-4 text-primary transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110" />
            </div>
            <span className="font-heading text-xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Sketch<span className="text-primary">Tutor</span>
            </span>
          </Link>

          {/* Center Nav Links */}
          <div className="flex items-center space-x-1 sm:space-x-2 text-[14px] font-medium hidden md:flex">
            <Link 
              href="/" 
              onClick={() => setActiveHash("")}
              className={cn(
                "relative flex items-center px-4 py-2 rounded-full transition-all duration-300 hover:text-primary hover:bg-primary/10",
                isHomeActive ? "text-primary bg-primary/10" : "text-muted-foreground"
              )}
            >
              Home
            </Link>
            <Link 
              href="/#how-it-works" 
              onClick={() => setActiveHash("#how-it-works")}
              className={cn(
                "relative flex items-center px-4 py-2 rounded-full transition-all duration-300 hover:text-primary hover:bg-primary/10",
                isHowItWorksActive ? "text-primary bg-primary/10" : "text-muted-foreground"
              )}
            >
              How it Works
            </Link>
          </div>

          {/* Right Section (Mobile links & Login) */}
          <div className="flex items-center space-x-4">
            {/* Show Home link on mobile */}
            <div className="md:hidden flex space-x-2">
              <Link 
                href="/" 
                onClick={() => setActiveHash("")}
                className={cn(
                  "text-[13px] font-medium px-3 py-1.5 rounded-full transition-colors",
                  isHomeActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary"
                )}
              >
                Home
              </Link>
            </div>
            
            <Link href="/login" className="flex">
              <Button 
                variant="default" 
                size="sm" 
                className="relative group h-9 px-5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md shadow-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/40 overflow-hidden"
              >
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                 <span className="relative flex items-center gap-1.5">
                   Login <ChevronRight className="h-3.5 w-3.5 opacity-70 group-hover:translate-x-0.5 transition-transform" />
                 </span>
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}

import { Button } from "@/components/ui/button";
import { Search, Bell, SlidersHorizontal, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

export default function GalleryPage() {
  const hasSketches = false; // Set to true to see populated state

  return (
    <main className="flex min-h-[calc(100vh-4rem)] h-[calc(100vh-4rem)] bg-background">
      {/* Sidebar Filters */}
      <aside className="w-64 border-r border-border/40 bg-card/20 hidden md:flex flex-col py-8 px-5">
        <h2 className="font-heading font-semibold text-lg mb-8 px-2 tracking-tight text-foreground/90">My Sketches</h2>
        <nav className="flex flex-col gap-2">
          <Button variant="secondary" className="justify-start bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary font-semibold rounded-xl h-11 px-4">All</Button>
          <Button variant="ghost" className="justify-start text-muted-foreground hover:text-foreground font-medium rounded-xl h-11 px-4">Pencil</Button>
          <Button variant="ghost" className="justify-start text-muted-foreground hover:text-foreground font-medium rounded-xl h-11 px-4">Pen</Button>
          <Button variant="ghost" className="justify-start text-muted-foreground hover:text-foreground font-medium rounded-xl h-11 px-4">Beginner</Button>
        </nav>
        
        <div className="mt-auto p-5 rounded-3xl bg-muted/30 border border-border/50 text-center shadow-inner relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/5 -z-10 group-hover:bg-primary/10 transition-colors"></div>
          <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20 shadow-sm group-hover:scale-110 transition-transform duration-500">
             <span className="font-bold text-xl">+</span>
          </div>
          <p className="text-sm font-semibold mb-4 leading-tight">Start a new drawing masterclass</p>
          <Link href="/upload"><Button size="sm" className="w-full rounded-xl bg-background border border-border/80 shadow-sm text-foreground hover:bg-muted font-semibold h-10">New Sketch</Button></Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-24 border-b border-border/30 bg-background/80 backdrop-blur-xl flex items-center justify-between px-6 lg:px-12 z-10 shrink-0">
           <div className="relative w-full max-w-lg hidden sm:block">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <input placeholder="Search sketches..." className="flex h-12 w-full pl-11 pr-4 bg-muted/40 border border-border/50 rounded-2xl focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50 text-base shadow-inner transition-colors focus:bg-background disabled:cursor-not-allowed disabled:opacity-50" />
           </div>
           
           <div className="flex items-center gap-5 ml-auto">
             <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-full h-12 w-12 relative">
               <Bell className="h-5 w-5" />
               <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-primary border-2 border-background rounded-full"></span>
             </Button>
             <div className="h-12 w-12 rounded-full bg-slate-800 border-2 border-primary/30 overflow-hidden flex items-center justify-center shadow-md hover:border-primary transition-colors cursor-pointer">
               <UserIcon className="h-5 w-5 text-muted-foreground" />
             </div>
           </div>
        </header>

        {/* Board Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-12">
          <div className="flex items-center justify-between mb-10">
            <h1 className="font-heading text-3xl font-bold tracking-tight">My Sketches / Gallery Page</h1>
            <Button variant="outline" size="icon" className="md:hidden h-12 w-12 rounded-2xl"><SlidersHorizontal className="h-5 w-5" /></Button>
            <Button variant="outline" className="hidden md:flex gap-2 rounded-2xl border-border/60 h-12 px-5 font-semibold text-muted-foreground hover:text-foreground bg-card/50 shadow-sm hover:shadow-md transition-all"><SlidersHorizontal className="h-4 w-4" /> Filter Views</Button>
          </div>

          {!hasSketches ? (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center max-w-sm mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="w-24 h-24 rounded-full bg-muted/30 flex items-center justify-center mb-8 border border-border shadow-inner">
                <ImageIcon className="h-10 w-10 text-muted-foreground/40" />
              </div>
              <h3 className="text-2xl font-heading font-bold mb-3 tracking-tight">No sketches yet.</h3>
              <p className="text-muted-foreground mb-10 text-balance leading-relaxed">Start your first AI-guided sketching masterclass to see your portfolio grow here.</p>
              <Link href="/upload"><Button size="lg" className="h-14 rounded-2xl px-8 shadow-xl shadow-primary/20 font-bold tracking-wide">Start your first sketch</Button></Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="bg-card/40 rounded-[2rem] border border-border/50 overflow-hidden shadow-sm hover:shadow-2xl hover:border-primary/40 transition-all duration-500 group flex flex-col">
                  {/* Image Grid */}
                  <div className="aspect-[2/1] bg-muted relative flex w-full overflow-hidden">
                    <div className="w-1/2 h-full bg-blue-900/10 border-r border-border/50 flex items-center justify-center relative group-hover:scale-105 transition-transform duration-700">
                       <span className="text-[9px] font-bold uppercase tracking-widest bg-background/90 px-2.5 py-1 rounded-full backdrop-blur-md absolute top-4 left-4 border border-border/50 text-foreground">Photo</span>
                    </div>
                    <div className="w-1/2 h-full bg-slate-900/40 flex items-center justify-center relative group-hover:scale-105 transition-transform duration-700">
                       <span className="text-[9px] font-bold uppercase tracking-widest bg-primary/20 text-primary border border-primary/30 px-2.5 py-1 rounded-full backdrop-blur-md absolute top-4 right-4">Sketch</span>
                    </div>
                  </div>
                  
                  {/* Card Details */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-heading font-bold text-xl mb-4 text-foreground/90">{item % 2 === 0 ? "Nature Study" : "Urban Scene"}</h3>
                    <div className="flex items-center gap-5 text-xs font-medium text-muted-foreground mb-8">
                      <span className="flex items-center gap-1.5"><CalendarIcon className="h-3.5 w-3.5" /> May {15 + item}, 2026</span>
                      <span className="flex items-center gap-1.5"><PencilIcon className="h-3.5 w-3.5" /> Pencil</span>
                      <span className="flex items-center gap-1.5"><UserIcon className="h-3.5 w-3.5" /> Beginner</span>
                    </div>
                    
                    <Link href="/workspace/123/step/1" className="block w-full mt-auto">
                       <Button variant="secondary" className="w-full h-12 rounded-xl bg-background border border-border/60 hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 font-semibold text-foreground group-hover:shadow-md">View Steps</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function CalendarIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
}
function PencilIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
}
function UserIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
}

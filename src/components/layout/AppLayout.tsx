import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,hsl(var(--foreground))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground))_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="glow-orb h-[420px] w-[420px] -top-32 -left-32" style={{ background: "radial-gradient(circle, #6366F1 0%, transparent 70%)" }} />
        <div className="glow-orb h-[480px] w-[480px] top-1/3 -right-40" style={{ background: "radial-gradient(circle, #9333EA 0%, transparent 70%)" }} />
        <div className="glow-orb h-[360px] w-[360px] bottom-0 left-1/3" style={{ background: "radial-gradient(circle, #EC4899 0%, transparent 70%)", opacity: 0.35 }} />
      </div>
      {/* Mobile header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center gap-3 border-b border-border bg-background/95 backdrop-blur-sm px-4 py-3 lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(true)}
          className="h-9 w-9"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <span className="font-display font-semibold text-foreground">CareerCraft</span>
      </header>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <main className={cn(
        "pt-14 lg:pt-0 transition-all duration-300",
        sidebarCollapsed ? "lg:pl-[72px]" : "lg:pl-64"
      )}>
        <div className="min-h-screen p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
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

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="lg:pl-64 pt-14 lg:pt-0">
        <div className="min-h-screen p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

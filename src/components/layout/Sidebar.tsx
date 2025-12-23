import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Compass,
  Target,
  FileText,
  MessageSquare,
  Map,
  DollarSign,
  Bookmark,
  CreditCard,
  LogOut,
  Sparkles,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/app/dashboard" },
  { icon: Compass, label: "Career Advice", path: "/app/career-advice" },
  { icon: Target, label: "Skill Assessment", path: "/app/skill-assessment" },
  { icon: FileText, label: "Resume Builder", path: "/app/resume-builder" },
  { icon: MessageSquare, label: "Interview Prep", path: "/app/interview-prep" },
  { icon: Map, label: "Career Roadmap", path: "/app/career-roadmap" },
  { icon: DollarSign, label: "Salary Insights", path: "/app/salary-insights" },
  { icon: Bookmark, label: "Saved Careers", path: "/app/saved-careers" },
  { icon: CreditCard, label: "Subscription", path: "/app/subscription" },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut();
    navigate("/login");
  };

  // Get user initials
  const getInitials = () => {
    const name = user?.user_metadata?.full_name || user?.email || "User";
    if (name.includes("@")) {
      return name.substring(0, 2).toUpperCase();
    }
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const getDisplayName = () => {
    return user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-border px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-foreground">CareerCraft</h1>
            <p className="text-xs text-muted-foreground">Design Your Future</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
            <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center">
              <span className="text-sm font-semibold text-primary-foreground">{getInitials()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{getDisplayName()}</p>
              <span className="plan-badge-premium text-[10px]">Free</span>
            </div>
            <button 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="p-2 rounded-lg hover:bg-background transition-colors"
            >
              {isLoggingOut ? (
                <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
              ) : (
                <LogOut className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

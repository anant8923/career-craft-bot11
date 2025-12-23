import { useEffect, useState } from "react";
import { Bookmark, Trash2, Map, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Json } from "@/integrations/supabase/types";

interface SavedCareer {
  id: string;
  title: string;
  saved_at: string;
  content: {
    description?: string;
    fitScore?: number;
    skills?: string[];
  };
}

export default function SavedCareers() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [careers, setCareers] = useState<SavedCareer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSavedCareers();
    }
  }, [user]);

  const fetchSavedCareers = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from("saved_careers")
        .select("*")
        .eq("user_id", user.id)
        .order("saved_at", { ascending: false });

      if (error) throw error;

      const formattedCareers: SavedCareer[] = (data || []).map((career) => ({
        id: career.id,
        title: career.title || "Unknown Career",
        saved_at: career.saved_at || new Date().toISOString(),
        content: (career.content as SavedCareer["content"]) || {},
      }));

      setCareers(formattedCareers);
    } catch (error) {
      console.error("Error fetching saved careers:", error);
      toast({
        title: "Error",
        description: "Failed to load saved careers.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const removeCareer = async (id: string) => {
    try {
      const { error } = await supabase
        .from("saved_careers")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setCareers(careers.filter((c) => c.id !== id));
      toast({
        title: "Career removed",
        description: "The career has been removed from your saved list.",
      });
    } catch (error) {
      console.error("Error removing career:", error);
      toast({
        title: "Error",
        description: "Failed to remove career. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-gradient-primary p-3">
            <Bookmark className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Saved Careers
            </h1>
            <p className="text-muted-foreground">
              Your bookmarked career paths for future reference
            </p>
          </div>
        </div>
      </div>

      {careers.length === 0 ? (
        <div className="glass-card p-12 text-center animate-fade-in">
          <Bookmark className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <h2 className="font-display text-lg font-semibold text-foreground mb-2">
            No saved careers yet
          </h2>
          <p className="text-muted-foreground mb-4">
            Explore career options and save the ones that interest you
          </p>
          <Link to="/app/career-advice">
            <Button variant="gradient">Explore Careers</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {careers.map((career, idx) => (
            <div
              key={career.id}
              className="glass-card overflow-hidden animate-slide-up opacity-0"
              style={{
                animationDelay: `${idx * 100}ms`,
                animationFillMode: "forwards",
              }}
            >
              <button
                onClick={() => toggleExpand(career.id)}
                className="w-full p-6 flex items-center justify-between hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                    <span className="text-lg font-bold text-primary-foreground">
                      {career.content?.fitScore || "--"}
                    </span>
                  </div>
                  <div className="text-left">
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {career.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Saved on {formatDate(career.saved_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {career.content?.fitScore && (
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        career.content.fitScore >= 80
                          ? "text-green-500"
                          : career.content.fitScore >= 60
                          ? "text-yellow-500"
                          : "text-orange-500"
                      )}
                    >
                      {career.content.fitScore}% match
                    </span>
                  )}
                  {expandedId === career.id ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </button>

              {expandedId === career.id && (
                <div className="px-6 pb-6 border-t border-border pt-4 animate-fade-in">
                  <p className="text-muted-foreground mb-4">
                    {career.content?.description || "No description available."}
                  </p>

                  {career.content?.skills && career.content.skills.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-foreground mb-2">
                        Key Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {career.content.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Link to="/app/career-roadmap">
                      <Button variant="gradient" size="sm">
                        <Map className="h-4 w-4" />
                        View Roadmap
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCareer(career.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

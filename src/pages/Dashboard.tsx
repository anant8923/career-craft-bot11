import { useEffect, useState } from "react";
import {
  Search,
  Bookmark,
  Trophy,
  Target,
  TrendingUp,
  Calendar,
  ChevronRight,
  Loader2,
  Plus,
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { SkillProgress } from "@/components/dashboard/SkillProgress";
import { ChatBot } from "@/components/dashboard/ChatBot";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Skill {
  id: string;
  skill_name: string;
  rating: number;
  category: string;
}

interface CareerGoal {
  id: string;
  goal: string;
  completed: boolean;
  created_at: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  created_at: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [profileName, setProfileName] = useState("there");
  const [metrics, setMetrics] = useState({
    careerQueries: 0,
    savedCareers: 0,
    achievements: 0,
    skillsAssessed: 0,
  });
  const [topSkills, setTopSkills] = useState<{ skill: string; level: number }[]>([]);
  const [goals, setGoals] = useState<CareerGoal[]>([]);
  const [recentActivity, setRecentActivity] = useState<
    { action: string; time: string; icon: typeof Search }[]
  >([]);
  const [newGoal, setNewGoal] = useState("");
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      // Fetch profile name
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();

      if (profile?.full_name) {
        setProfileName(profile.full_name.split(" ")[0]);
      }

      // Fetch metrics in parallel
      const [queriesResult, careersResult, achievementsResult, skillsResult] =
        await Promise.all([
          supabase
            .from("career_query_history")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id),
          supabase
            .from("saved_careers")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id),
          supabase
            .from("achievements")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id),
          supabase
            .from("skills")
            .select("*")
            .eq("user_id", user.id)
            .order("rating", { ascending: false })
            .limit(5),
        ]);

      setMetrics({
        careerQueries: queriesResult.count || 0,
        savedCareers: careersResult.count || 0,
        achievements: achievementsResult.count || 0,
        skillsAssessed: skillsResult.data?.length || 0,
      });

      // Set top skills
      if (skillsResult.data && skillsResult.data.length > 0) {
        setTopSkills(
          skillsResult.data.map((s: Skill) => ({
            skill: s.skill_name || "Unknown",
            level: s.rating || 5,
          }))
        );
      }

      // Fetch goals
      const { data: goalsData } = await supabase
        .from("career_goals")
        .select("*")
        .eq("user_id", user.id)
        .eq("completed", false)
        .order("created_at", { ascending: false })
        .limit(3);

      if (goalsData) {
        setGoals(goalsData as CareerGoal[]);
      }

      // Build recent activity from real data
      const activity: { action: string; time: string; icon: typeof Search }[] = [];

      // Get recent queries
      const { data: recentQueries } = await supabase
        .from("career_query_history")
        .select("query_type, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(2);

      if (recentQueries) {
        recentQueries.forEach((q) => {
          activity.push({
            action: `Used ${q.query_type} career guidance`,
            time: formatRelativeTime(q.created_at),
            icon: Search,
          });
        });
      }

      // Get recent saved careers
      const { data: recentSaved } = await supabase
        .from("saved_careers")
        .select("title, saved_at")
        .eq("user_id", user.id)
        .order("saved_at", { ascending: false })
        .limit(2);

      if (recentSaved) {
        recentSaved.forEach((c) => {
          activity.push({
            action: `Saved '${c.title}' career`,
            time: formatRelativeTime(c.saved_at),
            icon: Bookmark,
          });
        });
      }

      setRecentActivity(activity.slice(0, 4));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatRelativeTime = (dateStr: string | null): string => {
    if (!dateStr) return "Recently";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const handleAddGoal = async () => {
    if (!user || !newGoal.trim()) return;
    setIsAddingGoal(true);

    try {
      const { data, error } = await supabase
        .from("career_goals")
        .insert({
          user_id: user.id,
          goal: newGoal.trim(),
          completed: false,
        })
        .select()
        .single();

      if (error) throw error;

      setGoals((prev) => [data as CareerGoal, ...prev].slice(0, 3));
      setNewGoal("");
      setDialogOpen(false);
      toast({
        title: "Goal added",
        description: "Your new career goal has been saved.",
      });
    } catch (error) {
      console.error("Error adding goal:", error);
      toast({
        title: "Error",
        description: "Failed to add goal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingGoal(false);
    }
  };

  const handleCompleteGoal = async (goalId: string) => {
    try {
      await supabase
        .from("career_goals")
        .update({ completed: true })
        .eq("id", goalId);

      setGoals((prev) => prev.filter((g) => g.id !== goalId));
      toast({
        title: "Goal completed!",
        description: "Congratulations on achieving your goal!",
      });
    } catch (error) {
      console.error("Error completing goal:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="font-display text-3xl font-bold text-foreground">
          Welcome back, {profileName}! 👋
        </h1>
        <p className="mt-2 text-muted-foreground">
          Here's an overview of your career journey progress
        </p>
      </div>

      {/* Chat Bot - Career Assistant */}
      <ChatBot />

      {/* Metrics */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Career Queries"
          value={metrics.careerQueries}
          subtitle="Total queries"
          icon={Search}
          delay={100}
        />
        <MetricCard
          title="Saved Careers"
          value={metrics.savedCareers}
          subtitle="Exploring options"
          icon={Bookmark}
          delay={200}
        />
        <MetricCard
          title="Achievements"
          value={metrics.achievements}
          subtitle="Keep it up!"
          icon={Trophy}
          delay={300}
        />
        <MetricCard
          title="Skills Assessed"
          value={metrics.skillsAssessed}
          subtitle="Skills tracked"
          icon={Target}
          delay={400}
        />
      </div>

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Skills overview */}
        <div
          className="glass-card p-6 lg:col-span-2 animate-slide-up opacity-0 animation-delay-200"
          style={{ animationFillMode: "forwards" }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Top Skills
            </h2>
            <Link to="/app/skill-assessment">
              <Button variant="ghost" size="sm" className="gap-1">
                View all
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          {topSkills.length > 0 ? (
            <div className="space-y-4">
              {topSkills.map((item) => (
                <SkillProgress key={item.skill} {...item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No skills assessed yet</p>
              <Link to="/app/skill-assessment">
                <Button variant="link" className="mt-2">
                  Take skill assessment
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Recent activity */}
        <div
          className="glass-card p-6 animate-slide-up opacity-0 animation-delay-300"
          style={{ animationFillMode: "forwards" }}
        >
          <h2 className="font-display text-lg font-semibold text-foreground mb-6">
            Recent Activity
          </h2>
          {recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <activity.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No recent activity</p>
              <Link to="/app/career-advice">
                <Button variant="link" className="mt-2">
                  Start exploring careers
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Goals section */}
      <div
        className="glass-card p-6 animate-slide-up opacity-0 animation-delay-400"
        style={{ animationFillMode: "forwards" }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-lg font-semibold text-foreground">
            Career Goals
          </h2>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="gradient" size="sm">
                <Plus className="h-4 w-4" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Career Goal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Input
                  placeholder="e.g., Complete AWS certification"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddGoal()}
                />
                <Button
                  variant="gradient"
                  className="w-full"
                  onClick={handleAddGoal}
                  disabled={isAddingGoal || !newGoal.trim()}
                >
                  {isAddingGoal ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Add Goal"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        {goals.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className="rounded-xl border border-border bg-muted/30 p-4 hover:border-primary/30 transition-colors cursor-pointer"
                onClick={() => handleCompleteGoal(goal.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {goal.goal}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Click to complete
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No goals set yet. Add your first career goal!</p>
          </div>
        )}
      </div>
    </div>
  );
}

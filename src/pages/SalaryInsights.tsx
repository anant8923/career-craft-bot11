import { useState } from "react";
import { DollarSign, TrendingUp, MapPin, Briefcase, Loader2, Lightbulb, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface SalaryData {
  entry: { min: number; max: number; currency: string };
  mid: { min: number; max: number; currency: string };
  senior: { min: number; max: number; currency: string };
  tips: string[];
  notes: string;
}

export default function SalaryInsights() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [experienceLevel, setExperienceLevel] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [salaryData, setSalaryData] = useState<SalaryData | null>(null);
  const [queriesRemaining, setQueriesRemaining] = useState<number | null>(null);

  const handleSearch = async () => {
    if (!role.trim()) {
      toast({
        title: "Job role required",
        description: "Please enter a job role to get salary insights.",
        variant: "destructive",
      });
      return;
    }

    if (!location.trim()) {
      toast({
        title: "Location required",
        description: "Please enter a location for accurate salary data.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setSalaryData(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please log in to use salary insights.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const response = await supabase.functions.invoke("llama-chat", {
        body: {
          query_type: "salary_insights",
          profile_text: `Role: ${role}, Location: ${location}${experienceLevel ? `, Experience: ${experienceLevel}` : ""}`,
          extra_context: {
            role,
            location,
            experience_level: experienceLevel || "all levels",
          },
        },
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to get salary insights");
      }

      const data = response.data;

      if (data.error) {
        if (data.upgradeMessage) {
          toast({
            title: "Query limit reached",
            description: data.upgradeMessage,
            variant: "destructive",
          });
        } else {
          throw new Error(data.error);
        }
        setIsLoading(false);
        return;
      }

      // Update queries remaining
      if (data.queriesRemaining !== undefined) {
        setQueriesRemaining(data.queriesRemaining);
      }

      setSalaryData({
        entry: data.entry || { min: 0, max: 0, currency: "USD" },
        mid: data.mid || { min: 0, max: 0, currency: "USD" },
        senior: data.senior || { min: 0, max: 0, currency: "USD" },
        tips: data.tips || [],
        notes: data.notes || "",
      });
    } catch (error) {
      console.error("Error fetching salary insights:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get salary insights. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatSalary = (amount: number, currency: string) => {
    if (currency === "INR") {
      // Format in lakhs for Indian Rupees
      if (amount >= 100000) {
        return `₹${(amount / 100000).toFixed(1)}L`;
      }
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(amount);
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getAverage = (min: number, max: number) => Math.round((min + max) / 2);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-gradient-primary p-3">
            <DollarSign className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Salary Insights
            </h1>
            <p className="text-muted-foreground">
              AI-powered salary data for your target roles
            </p>
          </div>
        </div>
        
        {/* Powered by LLaMA badge */}
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          Powered by Meta LLaMA
          {queriesRemaining !== null && (
            <span className="ml-2 text-primary">({queriesRemaining} queries remaining today)</span>
          )}
        </div>
      </div>

      <div className="glass-card p-6 animate-slide-up opacity-0 animation-delay-100" style={{ animationFillMode: "forwards" }}>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-1">
            <label className="text-sm font-medium text-foreground mb-2 block">
              Job Role *
            </label>
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="e.g., Data Scientist"
                className="pl-11"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Location *
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="e.g., India, USA"
                className="pl-11"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Experience Level
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                <SelectTrigger className="pl-11">
                  <SelectValue placeholder="All levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All levels</SelectItem>
                  <SelectItem value="entry">Entry Level (0-2 yrs)</SelectItem>
                  <SelectItem value="mid">Mid Level (3-5 yrs)</SelectItem>
                  <SelectItem value="senior">Senior Level (6+ yrs)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <Button
          variant="gradient"
          size="lg"
          className="w-full mt-6"
          onClick={handleSearch}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Getting insights...
            </>
          ) : (
            <>
              <TrendingUp className="h-5 w-5" />
              Get Salary Insights
            </>
          )}
        </Button>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Analyzing salary data with AI...</p>
        </div>
      )}

      {salaryData && !isLoading && (
        <div className="space-y-6 animate-fade-in">
          {/* Salary Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { level: "Entry Level", data: salaryData.entry, color: "from-blue-500 to-cyan-500" },
              { level: "Mid Level", data: salaryData.mid, color: "from-purple-500 to-pink-500" },
              { level: "Senior Level", data: salaryData.senior, color: "from-orange-500 to-yellow-500" },
            ].map((item, idx) => (
              <div
                key={item.level}
                className="glass-card-hover p-6 text-center animate-slide-up opacity-0"
                style={{ animationDelay: `${idx * 100}ms`, animationFillMode: "forwards" }}
              >
                <div
                  className={cn(
                    "h-2 w-full rounded-full bg-gradient-to-r mb-4",
                    item.color
                  )}
                />
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  {item.level}
                </h3>
                <p className="text-3xl font-bold font-display text-foreground mb-2">
                  {formatSalary(getAverage(item.data.min, item.data.max), item.data.currency)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatSalary(item.data.min, item.data.currency)} - {formatSalary(item.data.max, item.data.currency)}
                </p>
              </div>
            ))}
          </div>

          {/* Notes Section */}
          {salaryData.notes && (
            <div className="glass-card p-6">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">
                Market Overview
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {salaryData.notes}
              </p>
            </div>
          )}

          {/* Tips Section */}
          {salaryData.tips && salaryData.tips.length > 0 && (
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                <h2 className="font-display text-lg font-semibold text-foreground">
                  How to Increase Your Salary
                </h2>
              </div>
              <ul className="space-y-3">
                {salaryData.tips.map((tip, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-primary">{idx + 1}</span>
                    </div>
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground text-center">
            Salary data is AI-generated based on market trends and may vary. Always research current openings for accurate figures.
          </p>
        </div>
      )}
    </div>
  );
}

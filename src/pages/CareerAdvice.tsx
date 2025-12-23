import { useState } from "react";
import {
  Sparkles,
  Send,
  Loader2,
  GraduationCap,
  Briefcase,
  Heart,
  Target,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CareerCard } from "@/components/careers/CareerCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const educationLevels = [
  "High School",
  "Associate Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD",
  "Self-taught",
];

interface Career {
  title: string;
  description: string;
  fitScore: number;
  resources: { label: string; url: string }[];
}

export default function CareerAdvice() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [careers, setCareers] = useState<Career[]>([]);
  const [extraNotes, setExtraNotes] = useState("");
  const [formData, setFormData] = useState({
    education: "",
    fieldOfStudy: "",
    skills: "",
    interests: "",
    goals: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const profileText = `
Education: ${formData.education} in ${formData.fieldOfStudy || 'Not specified'}
Skills: ${formData.skills || 'Not specified'}
Interests: ${formData.interests || 'Not specified'}
Career Goals: ${formData.goals || 'Not specified'}
    `.trim();

    try {
      const { data, error } = await supabase.functions.invoke('llama-chat', {
        body: { 
          query_type: 'basic',
          profile_text: profileText
        }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      setCareers(data.careers || []);
      setExtraNotes(data.extraNotes || '');
      setShowResults(true);
    } catch (error) {
      console.error('Error getting career advice:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get career recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeepDive = async () => {
    setIsLoading(true);

    const profileText = `
Education: ${formData.education} in ${formData.fieldOfStudy || 'Not specified'}
Skills: ${formData.skills || 'Not specified'}
Interests: ${formData.interests || 'Not specified'}
Career Goals: ${formData.goals || 'Not specified'}
    `.trim();

    try {
      const { data, error } = await supabase.functions.invoke('llama-chat', {
        body: { 
          query_type: 'detailed',
          profile_text: profileText
        }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      setCareers(data.careers || []);
      setExtraNotes(data.extraNotes || data.industryTrends || '');
      setShowResults(true);
    } catch (error) {
      console.error('Error getting detailed advice:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get detailed analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const [savedCareers, setSavedCareers] = useState<string[]>([]);

  const toggleSave = (title: string) => {
    setSavedCareers((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-gradient-primary p-3">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              AI Career Guidance
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              Get personalized career recommendations
              <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                <Bot className="h-3 w-3" />
                Powered by Meta LLaMA
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-card p-6 animate-slide-up opacity-0 animation-delay-100" style={{ animationFillMode: "forwards" }}>
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="h-5 w-5 text-primary" />
            <h2 className="font-display font-semibold text-foreground">
              Education & Background
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Highest Education
              </label>
              <select
                className="flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={formData.education}
                onChange={(e) =>
                  setFormData({ ...formData, education: e.target.value })
                }
              >
                <option value="">Select level...</option>
                {educationLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Field of Study
              </label>
              <Input 
                placeholder="e.g., Computer Science, Business..." 
                value={formData.fieldOfStudy}
                onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 animate-slide-up opacity-0 animation-delay-200" style={{ animationFillMode: "forwards" }}>
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="h-5 w-5 text-primary" />
            <h2 className="font-display font-semibold text-foreground">
              Skills & Experience
            </h2>
          </div>
          <Textarea
            placeholder="List your key skills (e.g., Python, Data Analysis, Project Management, Communication...)"
            className="min-h-[100px]"
            value={formData.skills}
            onChange={(e) =>
              setFormData({ ...formData, skills: e.target.value })
            }
          />
        </div>

        <div className="glass-card p-6 animate-slide-up opacity-0 animation-delay-300" style={{ animationFillMode: "forwards" }}>
          <div className="flex items-center gap-2 mb-4">
            <Heart className="h-5 w-5 text-primary" />
            <h2 className="font-display font-semibold text-foreground">
              Interests & Passions
            </h2>
          </div>
          <Textarea
            placeholder="What topics excite you? What do you enjoy doing? (e.g., solving puzzles, helping others, creating things...)"
            className="min-h-[100px]"
            value={formData.interests}
            onChange={(e) =>
              setFormData({ ...formData, interests: e.target.value })
            }
          />
        </div>

        <div className="glass-card p-6 animate-slide-up opacity-0 animation-delay-400" style={{ animationFillMode: "forwards" }}>
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-primary" />
            <h2 className="font-display font-semibold text-foreground">
              Career Goals
            </h2>
          </div>
          <Textarea
            placeholder="What are your career aspirations? Where do you see yourself in 5 years?"
            className="min-h-[100px]"
            value={formData.goals}
            onChange={(e) =>
              setFormData({ ...formData, goals: e.target.value })
            }
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            type="submit"
            variant="gradient"
            size="lg"
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Analyzing your profile...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Get Career Recommendations
              </>
            )}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="lg"
            onClick={handleDeepDive}
            disabled={isLoading}
          >
            <Send className="h-5 w-5" />
            Deep Dive Analysis
          </Button>
        </div>
      </form>

      {/* Results */}
      {showResults && careers.length > 0 && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Recommended Career Paths
            </h2>
            <span className="text-sm text-muted-foreground">
              Based on your profile
            </span>
          </div>
          
          {extraNotes && (
            <div className="glass-card p-4 border-l-4 border-primary">
              <p className="text-sm text-muted-foreground">{extraNotes}</p>
            </div>
          )}
          
          <div className="space-y-4">
            {careers.map((career) => (
              <CareerCard
                key={career.title}
                {...career}
                isSaved={savedCareers.includes(career.title)}
                onSave={() => toggleSave(career.title)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

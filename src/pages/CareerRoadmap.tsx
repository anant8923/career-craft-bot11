import { Map, Sparkles, Loader2, CheckCircle2, Bot, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RoadmapPhase {
  name: string;
  duration: string;
  skills: string[];
  milestones: string[];
  resources?: { label: string; url: string }[];
}

interface RoadmapData {
  roadmap: RoadmapPhase[];
  estimatedTimeToGoal?: string;
  keyInsights?: string;
}

export default function CareerRoadmap() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [formData, setFormData] = useState({
    targetCareer: '',
    currentLevel: 'Beginner',
  });

  const handleGenerate = async () => {
    if (!formData.targetCareer) {
      toast({
        title: "Missing information",
        description: "Please enter your target career.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    const profileText = `
Target Career: ${formData.targetCareer}
Current Level: ${formData.currentLevel}
    `.trim();

    try {
      const { data, error } = await supabase.functions.invoke('llama-chat', {
        body: { 
          query_type: 'roadmap',
          profile_text: profileText
        }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      setRoadmapData(data);
    } catch (error) {
      console.error('Error generating roadmap:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate roadmap. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const phases = roadmapData?.roadmap || [];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-gradient-primary p-3">
            <Map className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Career Roadmap Generator
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              Get a personalized roadmap to your dream career
              <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                <Bot className="h-3 w-3" />
                Powered by Meta LLaMA
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 animate-slide-up opacity-0 animation-delay-100" style={{ animationFillMode: "forwards" }}>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Target Career
            </label>
            <Input 
              placeholder="e.g., Data Scientist, Product Manager" 
              value={formData.targetCareer}
              onChange={(e) => setFormData({ ...formData, targetCareer: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Current Level
            </label>
            <select 
              className="flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm"
              value={formData.currentLevel}
              onChange={(e) => setFormData({ ...formData, currentLevel: e.target.value })}
            >
              <option>Beginner</option>
              <option>Junior</option>
              <option>Mid-Level</option>
              <option>Senior</option>
            </select>
          </div>
        </div>
        <Button
          variant="gradient"
          size="lg"
          className="w-full mt-6"
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Building Your Roadmap...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              Generate Roadmap
            </>
          )}
        </Button>
      </div>

      {roadmapData && (
        <>
          {/* Key Insights */}
          {roadmapData.keyInsights && (
            <div className="glass-card p-4 border-l-4 border-primary animate-fade-in">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-foreground">💡 Key Insights</p>
                {roadmapData.estimatedTimeToGoal && (
                  <span className="text-sm text-muted-foreground">
                    Est. time: {roadmapData.estimatedTimeToGoal}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{roadmapData.keyInsights}</p>
            </div>
          )}

          {/* Roadmap Timeline */}
          <div className="space-y-0 animate-fade-in">
            {phases.map((phase, idx) => (
              <div key={phase.name} className="relative flex gap-6">
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "h-12 w-12 rounded-full flex items-center justify-center z-10",
                      idx === 0 ? "bg-gradient-primary" : "bg-muted border-2 border-primary/30"
                    )}
                  >
                    {idx === 0 ? (
                      <CheckCircle2 className="h-6 w-6 text-primary-foreground" />
                    ) : (
                      <span className="font-bold text-foreground">{idx + 1}</span>
                    )}
                  </div>
                  {idx < phases.length - 1 && (
                    <div className="w-0.5 flex-1 bg-gradient-to-b from-primary/30 to-primary/10" />
                  )}
                </div>

                {/* Content */}
                <div className="glass-card p-6 mb-6 flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-xl font-bold text-foreground">
                      {phase.name}
                    </h3>
                    <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                      {phase.duration}
                    </span>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-3">
                        Key Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {phase.skills?.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-3">
                        Milestones
                      </h4>
                      <ul className="space-y-2">
                        {phase.milestones?.map((milestone) => (
                          <li
                            key={milestone}
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                          >
                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                            {milestone}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Resources */}
                  {phase.resources && phase.resources.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <h4 className="text-sm font-semibold text-foreground mb-2">
                        Resources
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {phase.resources.map((resource, i) => (
                          <a
                            key={i}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                          >
                            {resource.label}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

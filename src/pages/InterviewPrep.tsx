import { MessageSquare, Sparkles, Loader2, Bot, Star, AlertTriangle, Hand, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const interviewTypes = [
  "Behavioral",
  "Technical",
  "Case Study",
  "Panel",
  "Phone Screen",
];

interface Question {
  question: string;
  sampleAnswer: string;
  tip: string;
}

interface StarExample {
  situation: string;
  task: string;
  action: string;
  result: string;
}

interface InterviewGuide {
  questions: Question[];
  starExamples: StarExample[];
  commonMistakes: string[];
  bodyLanguageTips: string[];
  closingQuestions: string[];
}

export default function InterviewPrep() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [guide, setGuide] = useState<InterviewGuide | null>(null);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    jobRole: '',
    experienceLevel: 'Entry Level',
    companyType: '',
    selectedTypes: [] as string[],
    additionalContext: '',
  });

  const toggleInterviewType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      selectedTypes: prev.selectedTypes.includes(type)
        ? prev.selectedTypes.filter(t => t !== type)
        : [...prev.selectedTypes, type]
    }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);

    const profileText = `
Target Role: ${formData.jobRole || 'Not specified'}
Experience Level: ${formData.experienceLevel}
Company Type: ${formData.companyType || 'Not specified'}
Interview Types: ${formData.selectedTypes.length > 0 ? formData.selectedTypes.join(', ') : 'General'}
Additional Context: ${formData.additionalContext || 'None'}
    `.trim();

    try {
      const { data, error } = await supabase.functions.invoke('llama-chat', {
        body: { 
          query_type: 'interview',
          profile_text: profileText
        }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      setGuide(data);
    } catch (error) {
      console.error('Error generating interview guide:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate guide. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-gradient-primary p-3">
            <MessageSquare className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Interview Preparation
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              Practice with AI-generated questions and expert tips
              <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                <Bot className="h-3 w-3" />
                Powered by Meta LLaMA
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="glass-card p-6 animate-slide-up opacity-0 animation-delay-100" style={{ animationFillMode: "forwards" }}>
            <h2 className="font-display font-semibold text-foreground mb-4">
              Interview Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Job Role
                </label>
                <Input 
                  placeholder="e.g., Software Engineer, Product Manager" 
                  value={formData.jobRole}
                  onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Experience Level
                </label>
                <select 
                  className="flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm"
                  value={formData.experienceLevel}
                  onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                >
                  <option>Entry Level</option>
                  <option>Junior (1-3 years)</option>
                  <option>Mid-Level (3-5 years)</option>
                  <option>Senior (5+ years)</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Company Type
                </label>
                <Input 
                  placeholder="e.g., Startup, Enterprise, FAANG" 
                  value={formData.companyType}
                  onChange={(e) => setFormData({ ...formData, companyType: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="glass-card p-6 animate-slide-up opacity-0 animation-delay-200" style={{ animationFillMode: "forwards" }}>
            <h2 className="font-display font-semibold text-foreground mb-4">
              Interview Types
            </h2>
            <div className="flex flex-wrap gap-2">
              {interviewTypes.map((type) => (
                <label
                  key={type}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition-colors ${
                    formData.selectedTypes.includes(type)
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-input bg-background hover:border-primary'
                  }`}
                  onClick={() => toggleInterviewType(type)}
                >
                  <input 
                    type="checkbox" 
                    className="rounded" 
                    checked={formData.selectedTypes.includes(type)}
                    onChange={() => {}}
                  />
                  <span className="text-sm">{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 animate-slide-up opacity-0 animation-delay-300" style={{ animationFillMode: "forwards" }}>
            <h2 className="font-display font-semibold text-foreground mb-4">
              Additional Context
            </h2>
            <Textarea
              placeholder="Any specific areas you want to focus on or challenges you're facing..."
              className="min-h-[100px]"
              value={formData.additionalContext}
              onChange={(e) => setFormData({ ...formData, additionalContext: e.target.value })}
            />
          </div>

          <Button
            variant="gradient"
            size="lg"
            className="w-full"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Preparing Your Guide...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Generate Interview Guide
              </>
            )}
          </Button>
        </div>

        <div className="space-y-6">
          {guide ? (
            <>
              {/* Sample Questions */}
              <div className="glass-card p-6 animate-scale-in">
                <h2 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Practice Questions
                </h2>
                <div className="space-y-3">
                  {guide.questions?.slice(0, 5).map((q, i) => (
                    <div 
                      key={i} 
                      className="p-4 rounded-xl bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
                      onClick={() => setExpandedQuestion(expandedQuestion === i ? null : i)}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-primary font-medium shrink-0">Q{i + 1}:</span>
                        <span className="text-sm">{q.question}</span>
                      </div>
                      {expandedQuestion === i && (
                        <div className="mt-3 pt-3 border-t border-border space-y-2 animate-fade-in">
                          <div>
                            <p className="text-xs font-medium text-primary mb-1">Sample Answer:</p>
                            <p className="text-xs text-muted-foreground">{q.sampleAnswer}</p>
                          </div>
                          {q.tip && (
                            <div className="flex items-start gap-1 text-xs text-yellow-600 bg-yellow-500/10 p-2 rounded">
                              <Star className="h-3 w-3 mt-0.5 shrink-0" />
                              <span>{q.tip}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* STAR Examples */}
              {guide.starExamples?.length > 0 && (
                <div className="glass-card p-6 animate-scale-in">
                  <h2 className="font-display font-semibold text-foreground mb-4">
                    STAR Method Examples
                  </h2>
                  {guide.starExamples.slice(0, 2).map((example, i) => (
                    <div key={i} className="mb-4 last:mb-0 p-3 rounded-lg bg-muted/30">
                      <div className="space-y-2 text-sm">
                        <div className="flex gap-2">
                          <span className="font-bold text-primary w-4">S</span>
                          <span className="text-muted-foreground">{example.situation}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="font-bold text-primary w-4">T</span>
                          <span className="text-muted-foreground">{example.task}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="font-bold text-primary w-4">A</span>
                          <span className="text-muted-foreground">{example.action}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="font-bold text-primary w-4">R</span>
                          <span className="text-muted-foreground">{example.result}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Common Mistakes */}
              {guide.commonMistakes?.length > 0 && (
                <div className="glass-card p-6 animate-scale-in">
                  <h2 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Common Mistakes to Avoid
                  </h2>
                  <ul className="space-y-2">
                    {guide.commonMistakes.slice(0, 4).map((mistake, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-destructive">×</span>
                        {mistake}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Body Language */}
              {guide.bodyLanguageTips?.length > 0 && (
                <div className="glass-card p-6 animate-scale-in">
                  <h2 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Hand className="h-5 w-5 text-primary" />
                    Body Language Tips
                  </h2>
                  <ul className="space-y-2">
                    {guide.bodyLanguageTips.slice(0, 4).map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-primary">✓</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <div className="glass-card p-6 flex items-center justify-center min-h-[300px] animate-slide-up opacity-0 animation-delay-200" style={{ animationFillMode: "forwards" }}>
              <div className="text-center text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Fill in the details and generate your personalized interview guide</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

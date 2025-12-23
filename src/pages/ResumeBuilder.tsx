import { FileText, Sparkles, Loader2, Bot, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Improvement {
  area: string;
  suggestion: string;
  priority: 'high' | 'medium' | 'low';
}

interface ResumeTips {
  skillsToHighlight: string[];
  actionVerbs: string[];
  metricsAdvice: string;
  formatTips: string[];
  atsKeywords: string[];
  overallScore: number;
  improvements: Improvement[];
}

export default function ResumeBuilder() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [tips, setTips] = useState<ResumeTips | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    summary: '',
    experience: '',
    skills: '',
  });

  const handleGenerate = async () => {
    setIsGenerating(true);

    const profileText = `
Resume Content:
Name: ${formData.fullName || 'Not provided'}
Professional Summary: ${formData.summary || 'Not provided'}
Work Experience: ${formData.experience || 'Not provided'}
Skills: ${formData.skills || 'Not provided'}
    `.trim();

    try {
      const { data, error } = await supabase.functions.invoke('llama-chat', {
        body: { 
          query_type: 'resume',
          profile_text: profileText
        }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      setTips(data);
    } catch (error) {
      console.error('Error generating resume tips:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate tips. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-destructive bg-destructive/10';
      case 'medium': return 'text-yellow-600 bg-yellow-500/10';
      case 'low': return 'text-green-600 bg-green-500/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-gradient-primary p-3">
            <FileText className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              AI Resume Builder
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              Get AI-powered tips to make your resume stand out
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
              Personal Information
            </h2>
            <div className="space-y-4">
              <Input 
                placeholder="Full Name" 
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
              <Input 
                placeholder="Email Address" 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <Input 
                placeholder="Phone Number" 
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <Input 
                placeholder="Location" 
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
              <Input 
                placeholder="LinkedIn URL" 
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              />
            </div>
          </div>

          <div className="glass-card p-6 animate-slide-up opacity-0 animation-delay-200" style={{ animationFillMode: "forwards" }}>
            <h2 className="font-display font-semibold text-foreground mb-4">
              Professional Summary
            </h2>
            <Textarea
              placeholder="Write a brief professional summary highlighting your key achievements and career objectives..."
              className="min-h-[120px]"
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            />
          </div>

          <div className="glass-card p-6 animate-slide-up opacity-0 animation-delay-300" style={{ animationFillMode: "forwards" }}>
            <h2 className="font-display font-semibold text-foreground mb-4">
              Experience
            </h2>
            <Textarea
              placeholder="Describe your work experience, including job titles, companies, dates, and key responsibilities..."
              className="min-h-[150px]"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            />
          </div>

          <div className="glass-card p-6 animate-slide-up opacity-0 animation-delay-400" style={{ animationFillMode: "forwards" }}>
            <h2 className="font-display font-semibold text-foreground mb-4">
              Skills
            </h2>
            <Textarea
              placeholder="List your technical and soft skills..."
              className="min-h-[100px]"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-6">
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
                Analyzing Resume...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Generate Resume Tips
              </>
            )}
          </Button>

          <div className="glass-card p-6 animate-slide-up opacity-0 animation-delay-200" style={{ animationFillMode: "forwards" }}>
            <h2 className="font-display font-semibold text-foreground mb-4">
              AI Recommendations
            </h2>
            
            {tips ? (
              <div className="space-y-4">
                {/* Overall Score */}
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-foreground">📊 Resume Score</p>
                    <span className="text-2xl font-bold text-primary">{tips.overallScore}/100</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-primary transition-all duration-500"
                      style={{ width: `${tips.overallScore}%` }}
                    />
                  </div>
                </div>

                {/* Skills to Highlight */}
                {tips.skillsToHighlight?.length > 0 && (
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <p className="font-medium text-foreground mb-2">💡 Skills to Highlight</p>
                    <div className="flex flex-wrap gap-2">
                      {tips.skillsToHighlight.map((skill, i) => (
                        <span key={i} className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Verbs */}
                {tips.actionVerbs?.length > 0 && (
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <p className="font-medium text-foreground mb-2">🎯 Strong Action Verbs</p>
                    <p className="text-sm text-muted-foreground">
                      {tips.actionVerbs.slice(0, 8).join(', ')}
                    </p>
                  </div>
                )}

                {/* Metrics Advice */}
                {tips.metricsAdvice && (
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <p className="font-medium text-foreground mb-2">📈 Quantify Achievements</p>
                    <p className="text-sm text-muted-foreground">{tips.metricsAdvice}</p>
                  </div>
                )}

                {/* ATS Keywords */}
                {tips.atsKeywords?.length > 0 && (
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <p className="font-medium text-foreground mb-2">🔍 ATS Keywords</p>
                    <div className="flex flex-wrap gap-2">
                      {tips.atsKeywords.map((keyword, i) => (
                        <span key={i} className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Improvements */}
                {tips.improvements?.length > 0 && (
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <p className="font-medium text-foreground mb-3">✨ Improvements</p>
                    <div className="space-y-2">
                      {tips.improvements.slice(0, 4).map((imp, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <span className={`text-xs px-1.5 py-0.5 rounded ${getPriorityColor(imp.priority)}`}>
                              {imp.priority}
                            </span>
                            <p className="text-sm text-muted-foreground mt-1">{imp.suggestion}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4 text-sm text-muted-foreground">
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <p className="font-medium text-foreground mb-2">💡 Action Verbs</p>
                  <p>Use strong action verbs like "Led", "Developed", "Implemented" to start your bullet points.</p>
                </div>
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <p className="font-medium text-foreground mb-2">📊 Quantify Achievements</p>
                  <p>Add metrics to your accomplishments. Instead of "Improved sales", write "Increased sales by 35%".</p>
                </div>
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <p className="font-medium text-foreground mb-2">🎯 ATS Optimization</p>
                  <p>Include keywords from the job description to pass Applicant Tracking Systems.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

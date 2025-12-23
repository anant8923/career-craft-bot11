import { useEffect, useState } from "react";
import { Target, Save, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const defaultSkillCategories = {
  Technical: [
    { name: "Python Programming", level: 5 },
    { name: "JavaScript", level: 5 },
    { name: "Data Analysis", level: 5 },
    { name: "Machine Learning", level: 5 },
    { name: "SQL & Databases", level: 5 },
    { name: "Cloud Computing", level: 5 },
  ],
  Soft: [
    { name: "Communication", level: 5 },
    { name: "Leadership", level: 5 },
    { name: "Problem Solving", level: 5 },
    { name: "Teamwork", level: 5 },
    { name: "Time Management", level: 5 },
    { name: "Adaptability", level: 5 },
  ],
  Creative: [
    { name: "Design Thinking", level: 5 },
    { name: "Content Writing", level: 5 },
    { name: "Visual Design", level: 5 },
    { name: "Storytelling", level: 5 },
    { name: "Innovation", level: 5 },
  ],
  Business: [
    { name: "Project Management", level: 5 },
    { name: "Strategic Planning", level: 5 },
    { name: "Market Analysis", level: 5 },
    { name: "Financial Literacy", level: 5 },
    { name: "Negotiation", level: 5 },
  ],
};

type CategoryKey = keyof typeof defaultSkillCategories;

export default function SkillAssessment() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [skills, setSkills] = useState(defaultSkillCategories);
  const [expandedCategories, setExpandedCategories] = useState<CategoryKey[]>([
    "Technical",
  ]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserSkills();
    }
  }, [user]);

  const fetchUserSkills = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;

      if (data && data.length > 0) {
        // Merge saved skills with defaults
        const updatedSkills = { ...defaultSkillCategories };

        data.forEach((skill) => {
          const category = skill.category as CategoryKey;
          if (category && updatedSkills[category]) {
            const skillIndex = updatedSkills[category].findIndex(
              (s) => s.name === skill.skill_name
            );
            if (skillIndex !== -1) {
              updatedSkills[category][skillIndex].level = skill.rating || 5;
            }
          }
        });

        setSkills(updatedSkills);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSkill = (
    category: CategoryKey,
    skillName: string,
    newLevel: number
  ) => {
    setSkills((prev) => ({
      ...prev,
      [category]: prev[category].map((skill) =>
        skill.name === skillName ? { ...skill, level: newLevel } : skill
      ),
    }));
    setHasChanges(true);
  };

  const toggleCategory = (category: CategoryKey) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const getCategoryAverage = (category: CategoryKey) => {
    const categorySkills = skills[category];
    return Math.round(
      categorySkills.reduce((sum, skill) => sum + skill.level, 0) /
        categorySkills.length
    );
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);

    try {
      // Delete existing skills for this user
      await supabase.from("skills").delete().eq("user_id", user.id);

      // Insert all skills
      const skillsToInsert = Object.entries(skills).flatMap(
        ([category, categorySkills]) =>
          categorySkills.map((skill) => ({
            user_id: user.id,
            category,
            skill_name: skill.name,
            rating: skill.level,
          }))
      );

      const { error } = await supabase.from("skills").insert(skillsToInsert);

      if (error) throw error;

      setHasChanges(false);
      toast({
        title: "Skills saved",
        description: "Your skill assessment has been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving skills:", error);
      toast({
        title: "Error",
        description: "Failed to save skills. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const categoryColors: Record<CategoryKey, string> = {
    Technical: "from-blue-500 to-cyan-500",
    Soft: "from-purple-500 to-pink-500",
    Creative: "from-orange-500 to-yellow-500",
    Business: "from-green-500 to-emerald-500",
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
      {/* Header */}
      <div className="animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-gradient-primary p-3">
            <Target className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Skill Assessment Center
            </h1>
            <p className="text-muted-foreground">
              Rate your skills to get better career recommendations
            </p>
          </div>
        </div>
      </div>

      {/* Category Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(Object.keys(skills) as CategoryKey[]).map((category, idx) => (
          <button
            key={category}
            onClick={() => {
              if (!expandedCategories.includes(category)) {
                toggleCategory(category);
              }
            }}
            className={cn(
              "glass-card-hover p-4 text-left animate-slide-up opacity-0",
              expandedCategories.includes(category) && "ring-2 ring-primary"
            )}
            style={{
              animationDelay: `${idx * 100}ms`,
              animationFillMode: "forwards",
            }}
          >
            <div
              className={cn(
                "h-2 w-full rounded-full bg-gradient-to-r mb-3",
                categoryColors[category]
              )}
            />
            <h3 className="font-display font-semibold text-foreground">
              {category}
            </h3>
            <p className="text-sm text-muted-foreground">
              {skills[category].length} skills
            </p>
            <div className="mt-2 flex items-center gap-2">
              <div className="text-2xl font-bold text-foreground">
                {getCategoryAverage(category)}
              </div>
              <span className="text-xs text-muted-foreground">/10 avg</span>
            </div>
          </button>
        ))}
      </div>

      {/* Skill Details */}
      <div className="space-y-4">
        {(Object.keys(skills) as CategoryKey[]).map((category) => (
          <div key={category} className="glass-card overflow-hidden animate-fade-in">
            <button
              onClick={() => toggleCategory(category)}
              className="w-full flex items-center justify-between p-6 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "h-10 w-10 rounded-xl bg-gradient-to-r flex items-center justify-center",
                    categoryColors[category]
                  )}
                >
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    {category} Skills
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {skills[category].length} skills · Average:{" "}
                    {getCategoryAverage(category)}/10
                  </p>
                </div>
              </div>
              {expandedCategories.includes(category) ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </button>

            {expandedCategories.includes(category) && (
              <div className="px-6 pb-6 space-y-6 border-t border-border pt-6">
                {skills[category].map((skill) => (
                  <div key={skill.name} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">
                        {skill.name}
                      </span>
                      <span className="text-sm font-semibold text-primary">
                        {skill.level}/10
                      </span>
                    </div>
                    <Slider
                      value={[skill.level]}
                      min={1}
                      max={10}
                      step={1}
                      onValueChange={([value]) =>
                        updateSkill(category, skill.name, value)
                      }
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Beginner</span>
                      <span>Intermediate</span>
                      <span>Expert</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          variant="gradient"
          size="lg"
          onClick={handleSave}
          disabled={isSaving || !hasChanges}
        >
          {isSaving ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Save className="h-5 w-5" />
          )}
          {hasChanges ? "Save Assessment" : "No Changes"}
        </Button>
      </div>
    </div>
  );
}

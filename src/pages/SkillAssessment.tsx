import { useEffect, useState } from "react";
import { Target, Save, ChevronDown, ChevronUp, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

/**
 * SKILL CATEGORIES CONFIGURATION
 * To add new categories or skills, simply modify this object.
 * Each category contains an array of skills with default level of 5.
 */
const allSkillCategories = {
  Technical: [
    { name: "Python Programming", level: 5 },
    { name: "JavaScript", level: 5 },
    { name: "Data Analysis", level: 5 },
    { name: "Machine Learning", level: 5 },
    { name: "SQL & Databases", level: 5 },
    { name: "Cloud Computing", level: 5 },
    { name: "DevOps & CI/CD", level: 5 },
    { name: "API Development", level: 5 },
  ],
  "Business & Management": [
    { name: "Project Management", level: 5 },
    { name: "Strategic Planning", level: 5 },
    { name: "Market Analysis", level: 5 },
    { name: "Financial Literacy", level: 5 },
    { name: "Negotiation", level: 5 },
    { name: "Business Development", level: 5 },
    { name: "Risk Management", level: 5 },
  ],
  "Creative & Design": [
    { name: "Visual Design", level: 5 },
    { name: "UI/UX Design", level: 5 },
    { name: "Content Writing", level: 5 },
    { name: "Storytelling", level: 5 },
    { name: "Video Editing", level: 5 },
    { name: "Graphic Design", level: 5 },
    { name: "Brand Design", level: 5 },
  ],
  "Communication & Interpersonal": [
    { name: "Public Speaking", level: 5 },
    { name: "Written Communication", level: 5 },
    { name: "Active Listening", level: 5 },
    { name: "Leadership", level: 5 },
    { name: "Teamwork", level: 5 },
    { name: "Conflict Resolution", level: 5 },
    { name: "Mentoring", level: 5 },
  ],
  "Other / General": [
    { name: "Problem Solving", level: 5 },
    { name: "Critical Thinking", level: 5 },
    { name: "Time Management", level: 5 },
    { name: "Adaptability", level: 5 },
    { name: "Research Skills", level: 5 },
    { name: "Attention to Detail", level: 5 },
  ],
};

type CategoryKey = keyof typeof allSkillCategories;

const categoryDescriptions: Record<CategoryKey, string> = {
  Technical: "Programming, data, cloud, and engineering skills",
  "Business & Management": "Leadership, strategy, and business operations",
  "Creative & Design": "Visual arts, content creation, and design thinking",
  "Communication & Interpersonal": "People skills, leadership, and collaboration",
  "Other / General": "Foundational skills applicable across all fields",
};

const categoryColors: Record<CategoryKey, string> = {
  Technical: "from-blue-500 to-cyan-500",
  "Business & Management": "from-green-500 to-emerald-500",
  "Creative & Design": "from-orange-500 to-yellow-500",
  "Communication & Interpersonal": "from-purple-500 to-pink-500",
  "Other / General": "from-gray-500 to-slate-500",
};

export default function SkillAssessment() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Step 1: Category selection, Step 2: Skill rating
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedCategories, setSelectedCategories] = useState<CategoryKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [skills, setSkills] = useState<Record<CategoryKey, { name: string; level: number }[]>>({} as any);
  const [expandedCategories, setExpandedCategories] = useState<CategoryKey[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (user) {
      checkExistingSkills();
    }
  }, [user]);

  const checkExistingSkills = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;

      if (data && data.length > 0) {
        // User has existing skills, load them and skip to step 2
        const categoriesWithData = new Set<CategoryKey>();
        const loadedSkills: Record<CategoryKey, { name: string; level: number }[]> = {} as any;

        // Initialize with defaults for categories that have saved data
        data.forEach((skill) => {
          const category = skill.category as CategoryKey;
          if (category && allSkillCategories[category]) {
            categoriesWithData.add(category);
          }
        });

        // Build skills object for selected categories
        categoriesWithData.forEach((category) => {
          loadedSkills[category] = allSkillCategories[category].map((defaultSkill) => {
            const savedSkill = data.find(
              (s) => s.category === category && s.skill_name === defaultSkill.name
            );
            return {
              name: defaultSkill.name,
              level: savedSkill?.rating ?? defaultSkill.level,
            };
          });
        });

        setSelectedCategories(Array.from(categoriesWithData));
        setSkills(loadedSkills);
        setExpandedCategories([Array.from(categoriesWithData)[0]]);
        setStep(2);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCategorySelection = (category: CategoryKey) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const proceedToRating = () => {
    if (selectedCategories.length === 0) {
      toast({
        title: "Select at least one category",
        description: "Please choose which skills you want to assess.",
        variant: "destructive",
      });
      return;
    }

    // Initialize skills for selected categories
    const initialSkills: Record<CategoryKey, { name: string; level: number }[]> = {} as any;
    selectedCategories.forEach((category) => {
      initialSkills[category] = [...allSkillCategories[category]];
    });

    setSkills(initialSkills);
    setExpandedCategories([selectedCategories[0]]);
    setStep(2);
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
    if (!categorySkills || categorySkills.length === 0) return 0;
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

      // Insert all skills from selected categories
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

  const resetAndChooseCategories = () => {
    setStep(1);
    setHasChanges(true);
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
              {step === 1
                ? "Choose what kind of skills you want to assess today"
                : "Rate your skills to get better career recommendations"}
            </p>
          </div>
        </div>
      </div>

      {/* Step 1: Category Selection */}
      {step === 1 && (
        <div className="space-y-6 animate-fade-in">
          <div className="glass-card p-6">
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">
              Select Skill Categories
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Pick one or more categories that match your background. You don't need to be technical - 
              choose what's relevant to you.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {(Object.keys(allSkillCategories) as CategoryKey[]).map((category, idx) => {
                const isSelected = selectedCategories.includes(category);
                return (
                  <button
                    key={category}
                    onClick={() => toggleCategorySelection(category)}
                    className={cn(
                      "glass-card-hover p-5 text-left animate-slide-up opacity-0 relative transition-all",
                      isSelected && "ring-2 ring-primary bg-primary/5"
                    )}
                    style={{
                      animationDelay: `${idx * 80}ms`,
                      animationFillMode: "forwards",
                    }}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "h-2 w-full rounded-full bg-gradient-to-r mb-3",
                        categoryColors[category]
                      )}
                    />
                    <h3 className="font-display font-semibold text-foreground">
                      {category}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {categoryDescriptions[category]}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {allSkillCategories[category].length} skills
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              variant="gradient"
              size="lg"
              onClick={proceedToRating}
              disabled={selectedCategories.length === 0}
            >
              Continue to Assessment
              <ChevronDown className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Skill Rating */}
      {step === 2 && (
        <>
          {/* Category Overview */}
          <div className="flex flex-wrap gap-4">
            {selectedCategories.map((category, idx) => (
              <button
                key={category}
                onClick={() => {
                  if (!expandedCategories.includes(category)) {
                    toggleCategory(category);
                  }
                }}
                className={cn(
                  "glass-card-hover p-4 text-left animate-slide-up opacity-0 flex-1 min-w-[200px]",
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
                <h3 className="font-display font-semibold text-foreground text-sm">
                  {category}
                </h3>
                <div className="mt-2 flex items-center gap-2">
                  <div className="text-2xl font-bold text-foreground">
                    {getCategoryAverage(category)}
                  </div>
                  <span className="text-xs text-muted-foreground">/10 avg</span>
                </div>
              </button>
            ))}
          </div>

          {/* Change Categories Link */}
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" onClick={resetAndChooseCategories}>
              Change Categories
            </Button>
          </div>

          {/* Skill Details */}
          <div className="space-y-4">
            {selectedCategories.map((category) => (
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
                        {category}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {skills[category]?.length || 0} skills · Average:{" "}
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

                {expandedCategories.includes(category) && skills[category] && (
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
        </>
      )}
    </div>
  );
}

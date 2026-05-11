import { Check, Sparkles, Crown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with basic career guidance",
    icon: Sparkles,
    features: [
      "5 career queries per day",
      "Basic skill assessment",
      "3 saved career paths",
      "Community forum access",
      "Email support",
    ],
    limitations: ["No interview prep", "No resume builder", "Basic roadmaps only"],
    buttonText: "Current Plan",
    buttonVariant: "outline" as const,
    isCurrent: true,
    badgeClass: "plan-badge-free",
  },
  {
    name: "Premium",
    price: "$12",
    period: "per month",
    description: "Advanced tools for serious career seekers",
    icon: Crown,
    features: [
      "50 career queries per day",
      "Full skill assessment suite",
      "Unlimited saved careers",
      "Interview preparation",
      "AI resume builder",
      "Detailed career roadmaps",
      "Priority email support",
      "Salary insights",
    ],
    limitations: [],
    buttonText: "Upgrade to Premium",
    buttonVariant: "gradient" as const,
    isCurrent: false,
    isPopular: true,
    badgeClass: "plan-badge-premium",
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    description: "Everything you need to accelerate your career",
    icon: Zap,
    features: [
      "Unlimited career queries",
      "All Premium features",
      "1-on-1 career coaching sessions",
      "Industry expert network access",
      "Personalized learning paths",
      "Job application tracking",
      "Company culture insights",
      "24/7 priority support",
      "Early access to new features",
    ],
    limitations: [],
    buttonText: "Go Pro",
    buttonVariant: "default" as const,
    isCurrent: false,
    badgeClass: "plan-badge-pro",
  },
];

export default function Subscription() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center animate-fade-in">
        <h1 className="font-display text-3xl md:text-4xl font-bold gradient-text tracking-tight">
          Choose Your Plan
        </h1>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
          Unlock your full potential with advanced career tools and personalized guidance
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {plans.map((plan, idx) => (
          <div
            key={plan.name}
            className={cn(
              "glass-card relative p-8 animate-slide-up opacity-0",
              plan.isPopular && "ring-2 ring-primary shadow-glow"
            )}
            style={{ animationDelay: `${idx * 100}ms`, animationFillMode: "forwards" }}
          >
            {plan.isPopular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1 rounded-full text-xs font-semibold bg-gradient-primary text-primary-foreground">
                  Most Popular
                </span>
              </div>
            )}

            <div className="flex items-center gap-3 mb-4">
              <div
                className={cn(
                  "rounded-xl p-3",
                  plan.name === "Free" && "bg-muted",
                  plan.name === "Premium" && "bg-gradient-primary",
                  plan.name === "Pro" && "bg-amber-500"
                )}
              >
                <plan.icon
                  className={cn(
                    "h-6 w-6",
                    plan.name === "Free" ? "text-muted-foreground" : "text-white"
                  )}
                />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-foreground">
                  {plan.name}
                </h2>
                <span className={plan.badgeClass}>{plan.name}</span>
              </div>
            </div>

            <div className="mb-4">
              <span className="text-4xl font-bold font-display text-foreground">
                {plan.price}
              </span>
              <span className="text-muted-foreground">/{plan.period}</span>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              {plan.description}
            </p>

            <Button
              variant={plan.buttonVariant}
              className="w-full mb-6"
              disabled={plan.isCurrent}
            >
              {plan.buttonText}
            </Button>

            <div className="space-y-3">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-sm text-foreground">{feature}</span>
                </div>
              ))}
              {plan.limitations.map((limitation) => (
                <div key={limitation} className="flex items-start gap-3 opacity-50">
                  <div className="rounded-full bg-muted p-1 mt-0.5">
                    <Check className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <span className="text-sm text-muted-foreground line-through">
                    {limitation}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* FAQ or Additional Info */}
      <div className="glass-card p-8 text-center animate-fade-in">
        <h3 className="font-display text-lg font-semibold text-foreground mb-2">
          Need a custom plan for your team?
        </h3>
        <p className="text-muted-foreground mb-4">
          Contact us for enterprise pricing and custom solutions
        </p>
        <Button variant="outline">Contact Sales</Button>
      </div>
    </div>
  );
}

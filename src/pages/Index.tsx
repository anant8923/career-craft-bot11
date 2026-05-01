import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  Target,
  Map,
  MessageSquare,
  DollarSign,
  Zap,
  TrendingUp,
  Brain,
  Palette,
  LineChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Sparkles,
    title: "AI Career Guidance",
    description: "Get personalized career recommendations powered by advanced AI",
  },
  {
    icon: Target,
    title: "Skill Assessment",
    description: "Evaluate your skills and identify areas for growth",
  },
  {
    icon: Map,
    title: "Career Roadmaps",
    description: "Follow step-by-step paths to your dream career",
  },
  {
    icon: MessageSquare,
    title: "Interview Prep",
    description: "Practice with AI-generated questions and expert tips",
  },
  {
    icon: DollarSign,
    title: "Salary Insights",
    description: "Explore compensation data for your target roles",
  },
];

const careerMatches = [
  { icon: Brain, title: "AI/ML Engineer", match: 94, color: "from-indigo-500 to-purple-500" },
  { icon: Palette, title: "Product Designer", match: 87, color: "from-pink-500 to-rose-500" },
  { icon: LineChart, title: "Data Scientist", match: 82, color: "from-fuchsia-500 to-pink-500" },
];

const skillBars = [40, 65, 50, 85, 70, 95];

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center gradient-hero-animated-bg overflow-hidden px-4 py-16 lg:py-0">
        {/* Grid overlay */}
        <div className="absolute inset-0 hero-grid-pattern opacity-60" />

        {/* Glow orbs */}
        <div className="glow-orb top-[-100px] left-[-80px] w-[400px] h-[400px] bg-indigo-500 animate-float" />
        <div className="glow-orb bottom-[-120px] right-[-60px] w-[450px] h-[450px] bg-pink-500 animate-float animation-delay-300" />
        <div className="glow-orb top-1/3 right-1/4 w-[300px] h-[300px] bg-purple-500 animate-float animation-delay-200" />

        <div className="relative z-10 container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            {/* LEFT — Text + CTA glass card */}
            <div className="animate-fade-in">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/15 backdrop-blur-sm text-white text-xs sm:text-sm mb-6 border border-white/20">
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                  AI-Powered Career Platform
                </div>

                <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.05] mb-5">
                  AI-Powered Career
                  <br />
                  Guidance{" "}
                  <span className="gradient-text-hero">Tailored Just for You</span>
                </h1>

                <p className="text-base sm:text-lg text-white/85 max-w-xl mb-8 leading-relaxed">
                  Discover your perfect career path with personalized AI insights, skill
                  roadmaps, and interview prep — built around you.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:items-center mb-8">
                  <Button
                    size="lg"
                    onClick={() => navigate("/login")}
                    className="btn-glow h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border-0 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 rounded-xl"
                  >
                    Start Free Career Analysis
                    <ArrowRight className="h-5 w-5 ml-1" />
                  </Button>
                </div>

                {/* Trust row */}
                <div className="flex flex-wrap gap-x-6 gap-y-3 text-white/85 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-white/15 p-1.5 border border-white/20">
                      <Zap className="h-3.5 w-3.5 text-yellow-300" />
                    </div>
                    AI Powered
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-white/15 p-1.5 border border-white/20">
                      <Target className="h-3.5 w-3.5 text-pink-300" />
                    </div>
                    Personalized Results
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-white/15 p-1.5 border border-white/20">
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-300" />
                    </div>
                    Career Growth
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT — Faux dashboard mockup */}
            <div className="relative animate-fade-in hidden md:block">
              {/* Floating accent badges */}
              <div className="absolute -top-4 -left-4 z-20 bg-white/15 backdrop-blur-md border border-white/30 rounded-2xl px-4 py-2.5 shadow-xl animate-float">
                <div className="flex items-center gap-2 text-white text-sm font-semibold">
                  <Sparkles className="h-4 w-4 text-yellow-300" />
                  +12 new paths
                </div>
              </div>

              <div className="absolute -bottom-4 -right-2 z-20 bg-white/15 backdrop-blur-md border border-white/30 rounded-2xl px-4 py-2.5 shadow-xl animate-float animation-delay-300">
                <div className="flex items-center gap-2 text-white text-sm font-semibold">
                  <TrendingUp className="h-4 w-4 text-emerald-300" />
                  ↑ 2.5x growth
                </div>
              </div>

              {/* Main mockup card */}
              <div className="relative bg-white/12 backdrop-blur-xl border border-white/25 rounded-3xl p-6 shadow-2xl animate-float-slow">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-400 to-pink-400 flex items-center justify-center font-bold text-white">
                      A
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">Your Career Match</div>
                      <div className="text-white/70 text-xs">Updated just now</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-300 text-xs">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    Live
                  </div>
                </div>

                {/* Suggestion rows */}
                <div className="space-y-3">
                  {careerMatches.map((m, i) => (
                    <div
                      key={m.title}
                      className="bg-white/10 border border-white/15 rounded-2xl p-3.5 flex items-center gap-3 animate-slide-up opacity-0"
                      style={{ animationDelay: `${300 + i * 120}ms`, animationFillMode: "forwards" }}
                    >
                      <div className={`rounded-xl bg-gradient-to-br ${m.color} p-2.5 shrink-0`}>
                        <m.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="text-white font-medium text-sm truncate">{m.title}</div>
                          <div className="text-white text-xs font-bold ml-2">{m.match}%</div>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/15 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300"
                            style={{ width: `${m.match}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Skill growth mini chart */}
                <div className="mt-5 pt-5 border-t border-white/15">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-white/85 text-xs font-semibold uppercase tracking-wider">
                      Skill Growth
                    </div>
                    <div className="text-emerald-300 text-xs font-semibold">+18% this week</div>
                  </div>
                  <div className="flex items-end gap-2 h-16">
                    {skillBars.map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-md bg-gradient-to-t from-indigo-400/70 to-pink-300/90"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hidden sm:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-1.5">
          <span className="text-white/60 text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2 animate-bounce-slow">
            <div className="w-1 h-2 rounded-full bg-white/60" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 sm:mb-16 animate-fade-in">
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Everything You Need to
              <span className="gradient-text"> Succeed</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-2">
              Comprehensive tools and insights to guide your career journey
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, idx) => (
              <div
                key={feature.title}
                className="glass-card-hover p-5 sm:p-6 lg:p-8 animate-slide-up opacity-0"
                style={{ animationDelay: `${idx * 100}ms`, animationFillMode: "forwards" }}
              >
                <div className="rounded-xl bg-gradient-primary p-2.5 sm:p-3 w-fit mb-4 sm:mb-6">
                  <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
                </div>
                <h3 className="font-display text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-24 gradient-hero-animated-bg relative overflow-hidden">
        <div className="absolute inset-0 hero-grid-pattern opacity-40" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="animate-fade-in">
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
              Ready to Transform Your Career?
            </h2>
            <p className="text-sm sm:text-base text-white/85 max-w-xl mx-auto mb-8 sm:mb-10 px-2">
              Join thousands of professionals who have accelerated their careers
              with CareerCraft's AI-powered guidance.
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/login")}
              className="btn-glow h-12 sm:h-14 px-6 sm:px-10 text-base sm:text-lg font-semibold bg-white text-purple-700 hover:bg-white rounded-xl"
            >
              Get Your Career Plan
              <ArrowRight className="h-5 w-5 ml-1" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

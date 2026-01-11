import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Zap,
  Target,
  Calendar,
  TrendingUp,
  FileText,
  Brain,
  CheckCircle,
  ArrowRight,
  Star,
  Sparkles,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Target,
    title: "Smart Role Matching",
    description: "AI-powered recommendations based on your skills and experience",
  },
  {
    icon: Calendar,
    title: "Adaptive Roadmaps",
    description: "Dynamic study plans that adjust to your progress and weak areas",
  },
  {
    icon: FileText,
    title: "Resume Gap Analysis",
    description: "Real-time feedback to optimize your resume for target roles",
  },
  {
    icon: Brain,
    title: "Daily Assessments",
    description: "Quick quizzes that identify areas needing extra focus",
  },
];

const steps = [
  { number: "01", title: "Upload Resume", description: "Start with your current resume" },
  { number: "02", title: "Set Goals", description: "Define your target role and timeline" },
  { number: "03", title: "Follow Roadmap", description: "Complete daily tasks and assessments" },
  { number: "04", title: "Ace Interview", description: "Land your dream job" },
];

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/onboarding")}>
              Sign In
            </Button>
            <Button onClick={() => navigate("/onboarding")}>
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Interview Preparation
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6"
          >
            Your Personalized Path to{" "}
            <span className="text-gradient">Interview Success</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            PrepPulse transforms your resume into a dynamic, adaptive study roadmap.
            Master every topic, close every gap, and land your dream role.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="xl" onClick={() => navigate("/onboarding")}>
              <Zap className="w-5 h-5" />
              Start Your Journey
            </Button>
            <Button size="xl" variant="outline">
              Watch Demo
            </Button>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
  <div className="flex -space-x-2">
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary border-2 border-background"
      />
    ))}
  </div>
  <span>AI-driven roadmap engine</span>
</div>

<div className="flex items-center gap-1">
  <Star className="w-4 h-4 text-accent" />
  <span className="ml-1">Powered by Google Gemini</span>
</div>

          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-card">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              A comprehensive toolkit designed to maximize your interview preparation efficiency
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-background rounded-2xl border border-border p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg">
              Four simple steps to your dream job
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary to-transparent" />
                )}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary text-white font-display text-xl font-bold mb-4">
                    {step.number}
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-12 text-center text-white"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Ready to Land Your Dream Job?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of professionals who've transformed their interview
              performance with PrepPulse
            </p>
            <Button
              size="xl"
              onClick={() => navigate("/onboarding")}
              className="bg-white text-primary hover:bg-white/90"
            >
              <Sparkles className="w-5 h-5" />
              Start Free Today
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo />
          <p className="text-sm text-muted-foreground">
            © 2025 PrepPulse. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

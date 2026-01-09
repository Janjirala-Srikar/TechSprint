import { motion } from "framer-motion";
import {
  FileText,
  CheckCircle,
  AlertCircle,
  XCircle,
  TrendingUp,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ResumeItem {
  category: string;
  status: "match" | "improve" | "missing";
  description: string;
  suggestion?: string;
}

interface ResumeAnalysisProps {
  targetRole: string;
  items: ResumeItem[];
  overallScore: number;
}

const statusConfig = {
  match: {
    icon: CheckCircle,
    color: "text-match",
    bg: "bg-match/10",
    label: "Strong Match",
  },
  improve: {
    icon: AlertCircle,
    color: "text-improve",
    bg: "bg-improve/10",
    label: "Can Improve",
  },
  missing: {
    icon: XCircle,
    color: "text-missing",
    bg: "bg-missing/10",
    label: "Missing",
  },
};

export function ResumeAnalysis({ targetRole, items, overallScore }: ResumeAnalysisProps) {
  const matchCount = items.filter((i) => i.status === "match").length;
  const improveCount = items.filter((i) => i.status === "improve").length;
  const missingCount = items.filter((i) => i.status === "missing").length;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground">
              Resume Analysis
            </h3>
            <p className="text-sm text-muted-foreground">
              vs. {targetRole}
            </p>
          </div>
        </div>

        {/* Overall Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Match Score
            </span>
            <span className="text-2xl font-display font-bold text-foreground">
              {overallScore}%
            </span>
          </div>
          <Progress value={overallScore} className="h-3" />
        </div>

        {/* Summary */}
        <div className="flex items-center gap-4 mt-4 text-sm">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-match" />
            <span className="text-muted-foreground">{matchCount} matches</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-improve" />
            <span className="text-muted-foreground">{improveCount} to improve</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-missing" />
            <span className="text-muted-foreground">{missingCount} missing</span>
          </div>
        </div>
      </div>

      {/* Analysis Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {items.map((item, index) => {
          const config = statusConfig[item.status];
          const Icon = config.icon;

          return (
            <motion.div
              key={item.category}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "p-4 rounded-xl border transition-all",
                config.bg,
                "border-transparent hover:shadow-md"
              )}
            >
              <div className="flex items-start gap-3">
                <Icon className={cn("w-5 h-5 mt-0.5 shrink-0", config.color)} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground text-sm">
                      {item.category}
                    </h4>
                    <span className={cn("text-xs font-medium", config.color)}>
                      {config.label}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.description}
                  </p>
                  {item.suggestion && (
                    <div className="mt-2 flex items-start gap-2 p-2 rounded-lg bg-background/50">
                      <Lightbulb className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground">
                        {item.suggestion}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Action */}
      <div className="p-4 border-t border-border">
        <Button className="w-full" variant="outline">
          <TrendingUp className="w-4 h-4" />
          View Full Analysis
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

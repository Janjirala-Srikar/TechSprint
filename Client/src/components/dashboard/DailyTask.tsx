import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Circle,
  Clock,
  BookOpen,
  Code,
  MessageSquare,
  Brain,
  ChevronDown,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface Task {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: "reading" | "coding" | "behavioral" | "system-design";
  completed: boolean;
  resources?: { title: string; url: string }[];
  isWeakArea?: boolean;
}

interface DailyTaskProps {
  task: Task;
  onToggle: (id: string) => void;
}

const typeIcons = {
  reading: BookOpen,
  coding: Code,
  behavioral: MessageSquare,
  "system-design": Brain,
};

const typeColors = {
  reading: "text-primary",
  coding: "text-secondary",
  behavioral: "text-accent",
  "system-design": "text-purple-500",
};

export function DailyTask({ task, onToggle }: DailyTaskProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = typeIcons[task.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "bg-card rounded-xl border p-4 transition-all",
        task.completed ? "border-success/30 bg-success/5" : "border-border",
        task.isWeakArea && !task.completed && "border-warning/50 bg-warning/5"
      )}
    >
      <div className="flex items-start gap-4">
        <div className="pt-0.5">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onToggle(task.id)}
            className={cn(
              "w-5 h-5",
              task.completed && "bg-success border-success"
            )}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <Icon className={cn("w-4 h-4", typeColors[task.type])} />
              <h4
                className={cn(
                  "font-medium text-foreground",
                  task.completed && "line-through text-muted-foreground"
                )}
              >
                {task.title}
              </h4>
              {task.isWeakArea && !task.completed && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-warning/20 text-warning text-xs font-medium">
                  <AlertTriangle className="w-3 h-3" />
                  Review
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
              <Clock className="w-3 h-3" />
              {task.duration}
            </span>
          </div>

          <p className="text-sm text-muted-foreground mt-1">
            {task.description}
          </p>

          {task.resources && task.resources.length > 0 && (
            <div className="mt-3">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Resources ({task.resources.length})
                <ChevronDown
                  className={cn(
                    "w-3 h-3 transition-transform",
                    isExpanded && "rotate-180"
                  )}
                />
              </button>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 space-y-1.5">
                      {task.resources.map((resource) => (
                        <a
                          key={resource.url}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          {resource.title}
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

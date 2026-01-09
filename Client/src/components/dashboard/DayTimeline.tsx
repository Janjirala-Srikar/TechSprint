import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Trophy,
  Calendar,
  CheckCircle2,
  Circle,
  Flame,
} from "lucide-react";
import { DailyTask, Task } from "./DailyTask";
import { DailyAssessment } from "./DailyAssessment";
import { cn } from "@/lib/utils";

interface DayTimelineProps {
  day: number;
  date: string;
  tasks: Task[];
  isToday: boolean;
  isMilestone: boolean;
  onTaskToggle: (taskId: string) => void;
  onAssessmentComplete: (score: number, weakAreas: string[]) => void;
}

export function DayTimeline({
  day,
  date,
  tasks,
  isToday,
  isMilestone,
  onTaskToggle,
  onAssessmentComplete,
}: DayTimelineProps) {
  const [isExpanded, setIsExpanded] = useState(isToday);
  const completedTasks = tasks.filter((t) => t.completed).length;
  const progress = (completedTasks / tasks.length) * 100;
  const allCompleted = completedTasks === tasks.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative"
    >
      {/* Timeline connector */}
      <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-border" />

      {/* Day header */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-full flex items-center gap-4 p-4 rounded-2xl transition-all group",
          isToday
            ? "bg-primary/10 border-2 border-primary"
            : allCompleted
            ? "bg-success/5 border border-success/30"
            : "bg-card border border-border hover:border-primary/30"
        )}
      >
        {/* Day indicator */}
        <div
          className={cn(
            "relative z-10 w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold text-lg transition-all",
            isToday
              ? "gradient-primary text-white"
              : allCompleted
              ? "bg-success text-white"
              : isMilestone
              ? "gradient-accent text-white"
              : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
          )}
        >
          {allCompleted ? (
            <CheckCircle2 className="w-6 h-6" />
          ) : isMilestone ? (
            <Trophy className="w-5 h-5" />
          ) : (
            day
          )}
        </div>

        <div className="flex-1 text-left">
          <div className="flex items-center gap-2">
            <h3 className="font-display font-semibold text-foreground">
              Day {day}
            </h3>
            {isToday && (
              <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1">
                <Flame className="w-3 h-3" />
                Today
              </span>
            )}
            {isMilestone && (
              <span className="px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-xs font-medium">
                Milestone
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {date}
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-sm font-medium text-foreground">
              {completedTasks}/{tasks.length}
            </span>
            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden mt-1">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className={cn(
                  "h-full rounded-full",
                  allCompleted ? "bg-success" : "gradient-progress"
                )}
              />
            </div>
          </div>
          <ChevronDown
            className={cn(
              "w-5 h-5 text-muted-foreground transition-transform",
              isExpanded && "rotate-180"
            )}
          />
        </div>
      </motion.button>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="ml-6 pl-8 py-4 space-y-3">
              {tasks.map((task) => (
                <DailyTask key={task.id} task={task} onToggle={onTaskToggle} />
              ))}

              {/* Daily Assessment */}
              {allCompleted && (
                <DailyAssessment
                  day={day}
                  onComplete={onAssessmentComplete}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

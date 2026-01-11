import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { DailyTask, Task } from "./DailyTask";
import { DailyAssessment } from "./DailyAssessment";
import { cn } from "@/lib/utils";

interface DayTimelineProps {
  day: number;
  date: string;
  tasks: Task[];
  assessment: {
    questions: any[];
  };
  isMilestone: boolean;
  onTaskToggle: (taskId: string) => void;
  onAssessmentComplete: (score: number, weakAreas: string[]) => void;
}

export function DayTimeline({
  day,
  date,
  tasks,
  assessment,
  isMilestone,
  onTaskToggle,
  onAssessmentComplete,
}: DayTimelineProps) {
  const [expanded, setExpanded] = useState(day === 1);

  const completed = tasks.filter((t) => t.completed).length;
  const allDone = completed === tasks.length;

  return (
    <motion.div className="space-y-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full bg-card border rounded-2xl p-4 flex justify-between items-center"
      >
        <div>
          <h3 className="font-semibold">Day {day}</h3>
          <p className="text-sm text-muted-foreground">{date}</p>
        </div>
        <ChevronDown
          className={cn("transition-transform", expanded && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="pl-4 space-y-3"
          >
            {tasks.map((task) => (
              <DailyTask
                key={task.id}
                task={task}
                onToggle={onTaskToggle}
              />
            ))}

            {allDone && assessment.questions.length > 0 && (
              <DailyAssessment
                questions={assessment.questions}
                onComplete={onAssessmentComplete}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

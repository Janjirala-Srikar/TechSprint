import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DayTimeline } from "@/components/dashboard/DayTimeline";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { TodayFocus } from "@/components/dashboard/TodayFocus";
import { adaptGeminiResponse } from "@/lib/geminiAdapter";

/* ---------- TYPES ---------- */
interface Task {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: string;
  completed: boolean;
}

interface DayData {
  day: number;
  date: string;
  isMilestone: boolean;
  tasks: Task[];
  assessment: {
    questions: any[];
  };
}

/* ---------- COMPONENT ---------- */
export default function Dashboard() {
  const [days, setDays] = useState<DayData[]>([]);
  const [streak, setStreak] = useState(1);

  /* ---------- LOAD ROADMAP ---------- */
  useEffect(() => {
    const stored = sessionStorage.getItem("generatedRoadmap");

    if (!stored) {
      console.error("❌ No roadmap found in sessionStorage");
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      const adapted = adaptGeminiResponse(parsed);
      setDays(adapted);
    } catch (err) {
      console.error("❌ Failed to load roadmap:", err);
    }
  }, []);

  /* ---------- DERIVED STATS ---------- */
  const totalDays = days.length;

  const completedDays = days.filter((d) =>
    d.tasks.length > 0 && d.tasks.every((t) => t.completed)
  ).length;

  const totalTasks = days.reduce(
    (acc, d) => acc + d.tasks.length,
    0
  );

  const completedTasks = days.reduce(
    (acc, d) => acc + d.tasks.filter((t) => t.completed).length,
    0
  );

  // First day with pending tasks = "today"
  const today = days.find((d) =>
    d.tasks.some((t) => !t.completed)
  );

  /* ---------- HANDLERS ---------- */
  const handleTaskToggle = (dayIndex: number, taskId: string) => {
    setDays((prev) =>
      prev.map((day, i) =>
        i !== dayIndex
          ? day
          : {
              ...day,
              tasks: day.tasks.map((task) =>
                task.id === taskId
                  ? { ...task, completed: !task.completed }
                  : task
              ),
            }
      )
    );
  };

  const handleAssessmentComplete = (score: number) => {
    if (score >= 70) {
      setStreak((s) => s + 1);
    }
  };

  /* ---------- RENDER ---------- */
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userName="Ashish" currentStreak={streak} />

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* ===== STATS ===== */}
        <DashboardStats
          totalDays={totalDays}
          completedDays={completedDays}
          completedTasks={completedTasks}
          totalTasks={totalTasks}
          streak={streak}
        />

        {/* ===== TODAY FOCUS ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <div className="lg:col-span-2">
            <TodayFocus day={today} />
          </div>
        </div>

        {/* ===== ROADMAP TIMELINE ===== */}
        <div className="space-y-6">
          {days.length === 0 && (
            <p className="text-center text-muted-foreground">
              No roadmap data available.
            </p>
          )}

          {days.map((day, index) => (
            <DayTimeline
              key={day.day}
              day={day.day}
              date={day.date}
              tasks={day.tasks}
              assessment={day.assessment}
              isMilestone={day.isMilestone}
              onTaskToggle={(taskId) =>
                handleTaskToggle(index, taskId)
              }
              onAssessmentComplete={handleAssessmentComplete}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

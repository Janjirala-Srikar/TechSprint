import { Flame, CheckCircle, CalendarDays, TrendingUp } from "lucide-react";

interface DashboardStatsProps {
  totalDays: number;
  completedDays: number;
  completedTasks: number;
  totalTasks: number;
  streak: number;
}

export function DashboardStats({
  totalDays,
  completedDays,
  completedTasks,
  totalTasks,
  streak,
}: DashboardStatsProps) {
  const percent = Math.round((completedDays / totalDays) * 100);

  const stats = [
    {
      label: "Completion",
      value: `${percent}%`,
      icon: TrendingUp,
    },
    {
      label: "Days Done",
      value: `${completedDays}/${totalDays}`,
      icon: CalendarDays,
    },
    {
      label: "Tasks Done",
      value: `${completedTasks}/${totalTasks}`,
      icon: CheckCircle,
    },
    {
      label: "Streak",
      value: `${streak} days`,
      icon: Flame,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(({ label, value, icon: Icon }) => (
        <div
          key={label}
          className="bg-card border rounded-2xl p-5 flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-xl font-semibold text-foreground">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

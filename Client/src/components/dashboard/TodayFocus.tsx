import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TodayFocus({ day }: { day: any }) {
  if (!day) return null;

  const pending = day.tasks.filter((t: any) => !t.completed).slice(0, 3);

  return (
    <div className="bg-card border rounded-2xl p-6">
      <h1 className="font-semibold text-foreground mb-2 text-lg">
        Today’s Focus · Day {day.day}
      </h1>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {pending.map((task: any) => (
          <li key={task.id} className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            {task.title}
          </li>
        ))}
      </ul>

      <Button className="mt-4" size="sm">
        Continue Day {day.day}
        <ArrowRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
}

import { Task } from "@/components/dashboard/DailyTask";

function toArray(value: any): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") return [value];
  return [];
}

export function adaptGeminiResponse(raw: any[]) {
  if (!Array.isArray(raw)) return [];

  return raw.map((day) => {
    const tasks: Task[] = [];

    const keyTopics = toArray(day.key_topics);
    const practiceTasks = toArray(day.practice_tasks);
    const checkups = toArray(day.daily_checkup_questions);

    // Key Topics → Reading
    keyTopics.forEach((topic, i) => {
      tasks.push({
        id: `d${day.day}-kt-${i}`,
        title: topic,
        description: "Review concepts and patterns",
        duration: "30 min",
        type: "reading",
        completed: false,
      });
    });

    // Practice Tasks → Coding
    practiceTasks.forEach((task, i) => {
      tasks.push({
        id: `d${day.day}-pt-${i}`,
        title: "Practice Problem",
        description: task,
        duration: "45 min",
        type: "coding",
        completed: false,
      });
    });

    // Daily Checkups → Behavioral
    checkups.forEach((q, i) => {
      tasks.push({
        id: `d${day.day}-cq-${i}`,
        title: "Self Check",
        description: q,
        duration: "10 min",
        type: "behavioral",
        completed: false,
      });
    });

    return {
      day: day.day,
      date: `Day ${day.day}`,
      isMilestone: day.day % 7 === 0,
      tasks,
      assessment: {
        questions: [],
      },
    };
  });
}

// lib/roadmapNormalizer.ts
import { Task } from "@/components/dashboard/DailyTask";

/* ---------------- TYPES ---------------- */

export interface GeminiQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  topic: string;
}

export interface GeminiDay {
  day: number;
  date?: string;
  key_topics?: string[] | string;
  tasks?: {
    id: string;
    title: string;
    description: string;
    duration: string;
    type: "reading" | "coding" | "behavioral" | "system-design";
    resources?: { title: string; url: string }[];
  }[];
  assessment?: {
    questions?: GeminiQuestion[];
  };
}

export interface GeminiResponse {
  meta?: {
    targetRole?: string;
    durationDays?: number;
    difficulty?: string;
  };
  roadmap?: GeminiDay[];
}

/* ---------------- NORMALIZER ---------------- */

export function normalizeGeminiRoadmap(
  raw: GeminiResponse | GeminiDay[]
) {
  // ✅ SUPPORT BOTH STORAGE FORMATS
  const roadmapArray: GeminiDay[] = Array.isArray(raw)
    ? raw
    : raw.roadmap ?? [];

  return roadmapArray.map((day) => ({
    day: day.day,
    date: day.date ?? `Day ${day.day}`,
    isMilestone: day.day % 7 === 0,

    tasks:
      day.tasks?.map(
        (t): Task => ({
          ...t,
          completed: false,
        })
      ) ?? [],

    assessment: {
      questions: day.assessment?.questions ?? [],
    },
  }));
}

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  topic: string;
}

interface DailyAssessmentProps {
  questions: Question[];
  onComplete: (score: number, weakAreas: string[]) => void;
}

export function DailyAssessment({ questions, onComplete }: DailyAssessmentProps) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);

  const handleAnswer = (idx: number) => {
    setAnswers((a) => ({
      ...a,
      [questions[current].id]: idx,
    }));

    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    const correct = questions.filter(
      (q) => answers[q.id] === q.correctAnswer
    );

    const score = Math.round((correct.length / questions.length) * 100);
    const weakAreas = questions
      .filter((q) => answers[q.id] !== q.correctAnswer)
      .map((q) => q.topic);

    return (
      <Button
        className="w-full"
        onClick={() => onComplete(score, weakAreas)}
      >
        Continue
      </Button>
    );
  }

  const q = questions[current];

  return (
    <motion.div
      key={q.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-card border rounded-xl p-6"
    >
      <h4 className="font-medium mb-4">{q.question}</h4>

      <div className="space-y-2">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(i)}
            className="w-full text-left p-3 rounded-lg border hover:border-primary"
          >
            {opt}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

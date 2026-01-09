import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, CheckCircle, XCircle, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  topic: string;
}

interface DailyAssessmentProps {
  day: number;
  onComplete: (score: number, weakAreas: string[]) => void;
}

const sampleQuestions: Question[] = [
  {
    id: "1",
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    correctAnswer: 1,
    topic: "Data Structures",
  },
  {
    id: "2",
    question: "Which HTTP method is idempotent?",
    options: ["POST", "PATCH", "GET", "All of the above"],
    correctAnswer: 2,
    topic: "System Design",
  },
  {
    id: "3",
    question: "What does SOLID stand for in software design?",
    options: [
      "Single, Object, Liskov, Interface, Dependency",
      "Simple, Open, Linked, Integrated, Dynamic",
      "Single, Open, Liskov, Interface, Dependency",
      "None of the above",
    ],
    correctAnswer: 2,
    topic: "Design Principles",
  },
];

export function DailyAssessment({ day, onComplete }: DailyAssessmentProps) {
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [sampleQuestions[currentQuestion].id]: optionIndex,
    }));

    if (currentQuestion < sampleQuestions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      setTimeout(() => setShowResults(true), 300);
    }
  };

  const calculateResults = () => {
    let correct = 0;
    const weakAreas: string[] = [];

    sampleQuestions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correct++;
      } else {
        if (!weakAreas.includes(q.topic)) {
          weakAreas.push(q.topic);
        }
      }
    });

    return {
      score: Math.round((correct / sampleQuestions.length) * 100),
      correct,
      total: sampleQuestions.length,
      weakAreas,
    };
  };

  const handleComplete = () => {
    const results = calculateResults();
    onComplete(results.score, results.weakAreas);
  };

  if (!isStarted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl border border-primary/20 p-6 text-center"
      >
        <div className="w-12 h-12 rounded-full gradient-primary mx-auto mb-4 flex items-center justify-center">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <h4 className="font-display font-semibold text-foreground mb-2">
          Daily Assessment Ready
        </h4>
        <p className="text-sm text-muted-foreground mb-4">
          Test your knowledge with {sampleQuestions.length} quick questions
        </p>
        <Button onClick={() => setIsStarted(true)}>
          Start Assessment
          <ArrowRight className="w-4 h-4" />
        </Button>
      </motion.div>
    );
  }

  if (showResults) {
    const results = calculateResults();
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-xl border p-6"
      >
        <div className="text-center mb-6">
          <div
            className={cn(
              "w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center",
              results.score >= 70 ? "bg-success/10" : "bg-warning/10"
            )}
          >
            {results.score >= 70 ? (
              <Sparkles className="w-8 h-8 text-success" />
            ) : (
              <Brain className="w-8 h-8 text-warning" />
            )}
          </div>
          <h4 className="font-display text-2xl font-bold text-foreground">
            {results.score}%
          </h4>
          <p className="text-muted-foreground">
            {results.correct} of {results.total} correct
          </p>
        </div>

        {results.weakAreas.length > 0 && (
          <div className="bg-warning/10 rounded-lg p-4 mb-4">
            <p className="text-sm font-medium text-warning mb-2">
              Areas to focus on tomorrow:
            </p>
            <ul className="text-sm text-muted-foreground">
              {results.weakAreas.map((area) => (
                <li key={area} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-warning" />
                  {area}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button onClick={handleComplete} className="w-full" variant="progress">
          Continue to Next Day
          <ArrowRight className="w-4 h-4" />
        </Button>
      </motion.div>
    );
  }

  const question = sampleQuestions[currentQuestion];
  const selectedAnswer = answers[question.id];

  return (
    <motion.div
      key={currentQuestion}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-card rounded-xl border p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-primary">{question.topic}</span>
        <span className="text-sm text-muted-foreground">
          {currentQuestion + 1} / {sampleQuestions.length}
        </span>
      </div>

      <h4 className="font-medium text-foreground mb-4">{question.question}</h4>

      <div className="space-y-2">
        {question.options.map((option, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => handleAnswer(index)}
            disabled={selectedAnswer !== undefined}
            className={cn(
              "w-full p-3 rounded-lg border text-left transition-all",
              selectedAnswer === undefined
                ? "border-border hover:border-primary hover:bg-primary/5"
                : selectedAnswer === index
                ? index === question.correctAnswer
                  ? "border-success bg-success/10"
                  : "border-destructive bg-destructive/10"
                : index === question.correctAnswer
                ? "border-success bg-success/10"
                : "border-border opacity-50"
            )}
          >
            <span className="text-sm text-foreground">{option}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

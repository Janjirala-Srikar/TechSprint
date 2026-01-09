import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300",
              index < currentStep
                ? "bg-primary border-primary"
                : index === currentStep
                ? "border-primary bg-primary/10"
                : "border-muted bg-muted/50"
            )}
          >
            {index < currentStep ? (
              <Check className="w-5 h-5 text-primary-foreground" />
            ) : (
              <span
                className={cn(
                  "text-sm font-semibold",
                  index === currentStep ? "text-primary" : "text-muted-foreground"
                )}
              >
                {index + 1}
              </span>
            )}
          </motion.div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "w-16 h-0.5 mx-2 transition-all duration-300",
                index < currentStep ? "bg-primary" : "bg-muted"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

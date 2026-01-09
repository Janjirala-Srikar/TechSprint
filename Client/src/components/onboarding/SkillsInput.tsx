import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface SkillsInputProps {
  skills: string[];
  onSkillsChange: (skills: string[]) => void;
}

const suggestedSkills = [
  "JavaScript", "React", "TypeScript", "Node.js", "Python",
  "AWS", "Docker", "SQL", "System Design", "Data Structures",
  "Machine Learning", "Product Management", "Agile", "Leadership"
];

export function SkillsInput({ skills, onSkillsChange }: SkillsInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onSkillsChange([...skills, trimmed]);
    }
    setInputValue("");
  };

  const removeSkill = (skill: string) => {
    onSkillsChange(skills.filter((s) => s !== skill));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputValue) {
      e.preventDefault();
      addSkill(inputValue);
    }
  };

  const availableSuggestions = suggestedSkills.filter(
    (s) => !skills.includes(s)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="font-display text-2xl font-bold text-foreground">
          Your Core Skills
        </h2>
        <p className="text-muted-foreground">
          Add your technical skills and areas of expertise
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a skill and press Enter"
            className="flex-1"
          />
          <Button
            type="button"
            onClick={() => addSkill(inputValue)}
            disabled={!inputValue.trim()}
            size="icon"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="min-h-[60px] p-4 bg-card rounded-xl border">
          <AnimatePresence mode="popLayout">
            {skills.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center">
                No skills added yet
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <motion.div
                    key={skill}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    layout
                  >
                    <Badge
                      variant="secondary"
                      className="px-3 py-1.5 text-sm font-medium bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="ml-2 hover:text-destructive transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Suggestions
          </p>
          <div className="flex flex-wrap gap-2">
            {availableSuggestions.slice(0, 8).map((skill) => (
              <motion.button
                key={skill}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addSkill(skill)}
                className="px-3 py-1.5 text-sm rounded-lg border border-muted bg-muted/30 text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
              >
                + {skill}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

import { motion } from "framer-motion";
import { Target, Briefcase, Calendar, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface CareerGoalsProps {
  goals: {
    targetRole: string;
    targetCompany: string;
    timeline: string;
    aspirations: string;
  };
  onGoalsChange: (goals: CareerGoalsProps["goals"]) => void;
}

const roleOptions = [
  "Software Engineer",
  "Senior Software Engineer",
  "Staff Engineer",
  "Engineering Manager",
  "Product Manager",
  "Data Scientist",
  "DevOps Engineer",
  "Solutions Architect",
];

const timelineOptions = [
  { value: "7", label: "1 Week Sprint" },
  { value: "14", label: "2 Week Plan" },
  { value: "30", label: "30-Day Journey" },
  { value: "60", label: "60-Day Deep Dive" },
];

export function CareerGoals({ goals, onGoalsChange }: CareerGoalsProps) {
  const updateGoal = (key: keyof typeof goals, value: string) => {
    onGoalsChange({ ...goals, [key]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="font-display text-2xl font-bold text-foreground">
          Define Your Goals
        </h2>
        <p className="text-muted-foreground">
          Tell us about your career aspirations and timeline
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-foreground">
            <Target className="w-4 h-4 text-primary" />
            Target Role
          </Label>
          <Select
            value={goals.targetRole}
            onValueChange={(value) => updateGoal("targetRole", value)}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select your target role" />
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-foreground">
            <Briefcase className="w-4 h-4 text-primary" />
            Target Company (Optional)
          </Label>
          <Input
            value={goals.targetCompany}
            onChange={(e) => updateGoal("targetCompany", e.target.value)}
            placeholder="e.g., Google, Meta, Stripe"
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-foreground">
            <Calendar className="w-4 h-4 text-primary" />
            Preparation Timeline
          </Label>
          <Select
            value={goals.timeline}
            onValueChange={(value) => updateGoal("timeline", value)}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select your timeline" />
            </SelectTrigger>
            <SelectContent>
              {timelineOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-foreground">
            <ArrowRight className="w-4 h-4 text-primary" />
            Career Aspirations
          </Label>
          <Textarea
            value={goals.aspirations}
            onChange={(e) => updateGoal("aspirations", e.target.value)}
            placeholder="What do you want to achieve in your career? What motivates you?"
            className="min-h-[100px] resize-none"
          />
        </div>
      </div>
    </motion.div>
  );
}

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { StepIndicator } from "@/components/onboarding/StepIndicator";
import { ResumeUpload } from "@/components/onboarding/ResumeUpload";
import { SkillsInput } from "@/components/onboarding/SkillsInput";
import { CareerGoals } from "@/components/onboarding/CareerGoals";
import axios from "axios";

const steps = ["Resume", "Skills", "Goals"];

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [goals, setGoals] = useState({
    targetRole: "",
    targetCompany: "",
    timeline: "",
    aspirations: "",
  });

  const canContinue = () => {
    switch (currentStep) {
      case 0:
        return uploadedFile !== null;
      case 1:
        return skills.length >= 3;
      case 2:
        return goals.targetRole && goals.timeline;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save data and navigate to dashboard
      localStorage.setItem(
        "preppulse_profile",
        JSON.stringify({ skills, goals, hasResume: true })
      );
      navigate("/dashboard");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerateRoadmap = async () => {
    try {
      const roadmapDetails = { skills, goals, hasResume: !!uploadedFile };
      console.log("Sending roadmap details to backend:", roadmapDetails);

      const response = await axios.post("http://localhost:5000/api/roadmap", roadmapDetails);

      console.log("Response received from backend:", response.data);
      console.log("Roadmap saved successfully:", response.data);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving roadmap:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-6 border-b border-border bg-card">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Logo />
          <span className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-xl">
          {/* Step indicator */}
          <div className="mb-12">
            <StepIndicator steps={steps} currentStep={currentStep} />
          </div>

          {/* Step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 0 && (
                <ResumeUpload
                  onUpload={setUploadedFile}
                  uploadedFile={uploadedFile}
                />
              )}
              {currentStep === 1 && (
                <SkillsInput skills={skills} onSkillsChange={setSkills} />
              )}
              {currentStep === 2 && (
                <CareerGoals goals={goals} onGoalsChange={setGoals} />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-12">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            <Button
              onClick={
                currentStep === steps.length - 1
                  ? handleGenerateRoadmap
                  : handleNext
              }
              disabled={!canContinue()}
              size="lg"
              className="gap-2"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate My Roadmap
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>

          {/* Helper text */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            {currentStep === 0 &&
              "Your resume will be analyzed to personalize your preparation plan"}
            {currentStep === 1 && "Add at least 3 skills to continue"}
            {currentStep === 2 &&
              "Select your target role and timeline to continue"}
          </p>
        </div>
      </main>
    </div>
  );
}

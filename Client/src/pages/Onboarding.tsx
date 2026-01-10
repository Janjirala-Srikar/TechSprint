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

// ✅ IMPORTANT FIX
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist/legacy/build/pdf";
import pdfWorker from "pdfjs-dist/legacy/build/pdf.worker.min?url";

// ✅ Set worker source locally (NO CORS)
GlobalWorkerOptions.workerSrc = pdfWorker;

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
    if (currentStep === 0) return uploadedFile !== null;
    if (currentStep === 1) return skills.length >= 3;
    if (currentStep === 2) return goals.targetRole && goals.timeline;
    return false;
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate("/dashboard");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  // ✅ PDF extraction works now
  const extractPdfText = async (file: File): Promise<string> => {
    try {
      const buffer = await file.arrayBuffer();
      const pdf = await getDocument({ data: buffer }).promise;

      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item: any) => item.str).join(" ") + "\n";
      }
      return text;
    } catch (error) {
      console.error("PDF extraction failed:", error);
      return "";
    }
  };

  const handleGenerateRoadmap = async () => {
    try {
      let resumeContent = "";

      if (uploadedFile) {
        if (uploadedFile.type === "application/pdf") {
          resumeContent = await extractPdfText(uploadedFile);
        } else {
          resumeContent = await uploadedFile.text();
        }
      }

      const payload = {
        skills,
        goals: { ...goals, resumeContent },
        hasResume: !!uploadedFile,
      };

      console.log("Sending roadmap details:", payload);

      // Call Gemini backend endpoint to generate the plan
      const geminiResponse = await axios.post(
        "http://localhost:5000/api/gemini/generate-gemini",
        payload
      );

      console.log("Gemini plan:", geminiResponse.data.plan);
      // Optionally, you can navigate or store the plan in state
      // navigate("/dashboard");
    } catch (error) {
      console.error("Roadmap generation failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-6 border-b bg-card">
        <div className="max-w-4xl mx-auto flex justify-between">
          <Logo />
          <span className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
      </header>

      <main className="flex-1 flex justify-center items-center p-6">
        <div className="w-full max-w-xl">
          <StepIndicator steps={steps} currentStep={currentStep} />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {currentStep === 0 && (
                <ResumeUpload
                  uploadedFile={uploadedFile}
                  onUpload={setUploadedFile}
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

          <div className="flex justify-between mt-10">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>

            <Button
              disabled={!canContinue()}
              onClick={
                currentStep === steps.length - 1
                  ? handleGenerateRoadmap
                  : handleNext
              }
            >
              {currentStep === steps.length - 1 ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate My Roadmap
                </>
              ) : (
                <>
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

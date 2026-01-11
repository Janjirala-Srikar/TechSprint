import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles, AlertCircle, Loader } from "lucide-react";
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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const canContinue = () => {
    if (currentStep === 0) return uploadedFile !== null;
    if (currentStep === 1) return skills.length >= 3;
    if (currentStep === 2) return goals.targetRole && goals.timeline;
    return false;
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setError("");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setError("");
    }
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
      setIsLoading(true);
      setError("");
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
        goals: { ...goals, resumeContent: resumeContent.substring(0, 1000) },
        hasResume: !!uploadedFile,
      };

      console.log("Sending roadmap details:", payload);

      // Call Gemini backend endpoint to generate the plan
      const geminiResponse = await axios.post(
        `${API_BASE_URL}/api/gemini/generate-gemini`,
        payload,
        {
          timeout: 70000,
        }
      );

      console.log("Gemini response:", geminiResponse.data);

      // ✅ FIX: Ensure plan is an array before storing
      if (geminiResponse.data.plan) {
        let planData = geminiResponse.data.plan;
        
        // If plan is a string, parse it
        if (typeof planData === 'string') {
          console.log("Plan is a string, parsing...");
          // Try to extract JSON from the string
          const jsonMatch = planData.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            planData = JSON.parse(jsonMatch[0]);
          } else {
            planData = JSON.parse(planData);
          }
        }
        
        // Verify it's an array
        if (!Array.isArray(planData)) {
          throw new Error("Roadmap plan is not an array");
        }

        console.log("✅ Plan is valid array with", planData.length, "days");
        
        // Store as properly formatted JSON string
        sessionStorage.setItem("generatedRoadmap", JSON.stringify(planData));
        console.log("✅ Roadmap stored successfully");
        
        // Navigate to dashboard
        navigate("/dashboard");
      } else {
        setError("No plan received from server");
      }
    } catch (error: any) {
      console.error("Roadmap generation failed:", error);

      let errorMessage = "Failed to generate roadmap";

      if (error.code === "ECONNABORTED") {
        errorMessage = "Request timeout. Please try again.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
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

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </motion.div>
          )}

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

          <div className="flex justify-between mt-10 gap-4">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 0 || isLoading}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>

            <Button
              disabled={!canContinue() || isLoading}
              onClick={
                currentStep === steps.length - 1
                  ? handleGenerateRoadmap
                  : handleNext
              }
            >
              {currentStep === steps.length - 1 ? (
                <>
                  {isLoading ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate My Roadmap
                    </>
                  )}
                </>
              ) : (
                <>
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>

          {isLoading && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm text-muted-foreground mt-6"
            >
              ⏳ This may take 30-60 seconds. Please don't close this window.
            </motion.p>
          )}
        </div>
      </main>
    </div>
  );
}
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ResumeUploadProps {
  onUpload: (file: File) => void;
  uploadedFile: File | null;
}

export function ResumeUpload({ onUpload, uploadedFile }: ResumeUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        onUpload(e.dataTransfer.files[0]);
      }
    },
    [onUpload]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="font-display text-2xl font-bold text-foreground">
          Upload Your Resume
        </h2>
        <p className="text-muted-foreground">
          We'll analyze your experience to create a personalized preparation plan
        </p>
      </div>

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 text-center",
          isDragging
            ? "border-primary bg-primary/5 scale-[1.02]"
            : uploadedFile
            ? "border-success bg-success/5"
            : "border-muted hover:border-primary/50 hover:bg-muted/30"
        )}
      >
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        {uploadedFile ? (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border">
              <FileText className="w-5 h-5 text-primary" />
              <span className="font-medium text-foreground">{uploadedFile.name}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Click or drag to replace
            </p>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                Drag and drop your resume here
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                or click to browse (PDF, DOC, DOCX)
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Target,
  TrendingUp,
  Clock,
  BookOpen,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CompanyCard } from "@/components/dashboard/CompanyCard";
import { DayTimeline } from "@/components/dashboard/DayTimeline";
import { ResumeAnalysis } from "@/components/dashboard/ResumeAnalysis";
import { Button } from "@/components/ui/button";
import { Task } from "@/components/dashboard/DailyTask";
import axios from "axios";

const recommendedCompanies = [
  {
    name: "Stripe",
    logo: "S",
    location: "San Francisco, CA",
    role: "Senior Software Engineer",
    matchScore: 92,
    employees: "8,000+",
    tags: ["Fintech", "API", "Payments"],
  },
  {
    name: "Notion",
    logo: "N",
    location: "San Francisco, CA",
    role: "Full Stack Engineer",
    matchScore: 88,
    employees: "500+",
    tags: ["Productivity", "Collaboration"],
  },
  {
    name: "Linear",
    logo: "L",
    location: "Remote",
    role: "Software Engineer",
    matchScore: 85,
    employees: "100+",
    tags: ["Developer Tools", "Startup"],
  },
  {
    name: "Vercel",
    logo: "V",
    location: "Remote",
    role: "Platform Engineer",
    matchScore: 82,
    employees: "400+",
    tags: ["Cloud", "Frontend", "DX"],
  },
];

const generateTasks = (day: number): Task[] => {
  const baseTasks: Task[] = [
    {
      id: `${day}-1`,
      title: "Algorithm Practice",
      description: "Solve 2 medium difficulty problems on arrays and strings",
      duration: "45 min",
      type: "coding",
      completed: false,
      resources: [
        { title: "LeetCode Arrays", url: "https://leetcode.com/tag/array/" },
      ],
    },
    {
      id: `${day}-2`,
      title: "System Design Concepts",
      description: "Study distributed systems and caching strategies",
      duration: "30 min",
      type: "system-design",
      completed: false,
      resources: [
        { title: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer" },
      ],
    },
    {
      id: `${day}-3`,
      title: "Behavioral Prep",
      description: "Practice STAR method responses for leadership questions",
      duration: "20 min",
      type: "behavioral",
      completed: false,
    },
    {
      id: `${day}-4`,
      title: "Company Research",
      description: "Deep dive into company culture, products, and recent news",
      duration: "25 min",
      type: "reading",
      completed: false,
    },
  ];

  return baseTasks;
};

const resumeAnalysisItems = [
  {
    category: "Technical Skills",
    status: "match" as const,
    description: "Strong alignment with React, TypeScript, and Node.js requirements",
  },
  {
    category: "Years of Experience",
    status: "match" as const,
    description: "5+ years matches senior role expectations",
  },
  {
    category: "System Design",
    status: "improve" as const,
    description: "Add examples of large-scale system architecture work",
    suggestion: "Include specific metrics like QPS handled or data volumes processed",
  },
  {
    category: "Cloud Platforms",
    status: "improve" as const,
    description: "AWS mentioned but lacking specific services",
    suggestion: "Add experience with ECS, Lambda, or DynamoDB if applicable",
  },
  {
    category: "Leadership",
    status: "missing" as const,
    description: "No mention of team leadership or mentorship",
    suggestion: "Add examples of leading projects, code reviews, or mentoring juniors",
  },
  {
    category: "Quantifiable Impact",
    status: "missing" as const,
    description: "Missing specific metrics and outcomes",
    suggestion: "Add numbers: 'Reduced load time by 40%' or 'Served 1M daily users'",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState<typeof recommendedCompanies[0] | null>(null);
  const [days, setDays] = useState<{ day: number; date: string; tasks: Task[] }[]>([]);
  const [weakAreas, setWeakAreas] = useState<string[]>([]);

  useEffect(() => {
    // Generate 14-day roadmap
    const roadmap = Array.from({ length: 14 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return {
        day: i + 1,
        date: date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
        tasks: generateTasks(i + 1),
      };
    });
    setDays(roadmap);
  }, []);

  const handleTaskToggle = (taskId: string) => {
    setDays((prevDays) =>
      prevDays.map((day) => ({
        ...day,
        tasks: day.tasks.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        ),
      }))
    );
  };

  const handleAssessmentComplete = (score: number, newWeakAreas: string[]) => {
    setWeakAreas(newWeakAreas);
    // Mark weak areas in next day's tasks
    if (newWeakAreas.length > 0) {
      setDays((prevDays) =>
        prevDays.map((day, index) => {
          if (index === 1) {
            return {
              ...day,
              tasks: day.tasks.map((task) => ({
                ...task,
                isWeakArea: newWeakAreas.some(
                  (area) =>
                    task.title.toLowerCase().includes(area.toLowerCase()) ||
                    task.type === "system-design"
                ),
              })),
            };
          }
          return day;
        })
      );
    }
  };

  const handleFileUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('resume', file);

      console.log('Uploading resume to backend:', file.name);

      // Read the file content
      const fileContent = await file.text();
      console.log('Resume content:', fileContent);

      const response = await axios.post('http://localhost:5000/api/roadmap/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Resume upload response:', response.data);
      return { ...response.data, fileContent };
    } catch (error) {
      console.error('Error uploading resume:', error);
      throw error;
    }
  };

  const handleGenerateRoadmap = async (file) => {
    try {
      const uploadedResumeData = await handleFileUpload(file);

      const roadmapDetails = {
        title: 'My Roadmap', // Ensure title is included
        days,
        weakAreas,
        selectedCompany,
        resumeContent: uploadedResumeData,
      };
      console.log('Sending roadmap details to backend:', roadmapDetails);

      const response = await axios.post('http://localhost:5000/api/roadmap', roadmapDetails);

      console.log('Response received from backend:', response.data);
      console.log('Roadmap saved successfully:', response.data);
    } catch (error) {
      console.error('Error saving roadmap:', error);
    }
  };

  const totalTasks = days.reduce((acc, day) => acc + day.tasks.length, 0);
  const completedTasks = days.reduce(
    (acc, day) => acc + day.tasks.filter((t) => t.completed).length,
    0
  );
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (!selectedCompany) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader userName="Alex" currentStreak={7} />

        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Welcome section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Welcome back, Alex 👋
            </h1>
            <p className="text-muted-foreground">
              Ready to continue your interview preparation journey?
            </p>
          </motion.div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
            {[
              { icon: Target, label: "Target Role", value: "Senior Engineer", color: "text-primary" },
              { icon: Clock, label: "Days Remaining", value: "14", color: "text-secondary" },
              { icon: TrendingUp, label: "Match Score", value: "85%", color: "text-success" },
              { icon: BookOpen, label: "Topics Covered", value: "12/24", color: "text-accent" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl border border-border p-5"
              >
                <stat.icon className={`w-6 h-6 ${stat.color} mb-3`} />
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="font-display text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Recommended companies */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-xl font-semibold text-foreground">
                  Recommended for You
                </h2>
                <p className="text-sm text-muted-foreground">
                  Based on your skills and experience
                </p>
              </div>
              <Button variant="ghost" className="text-primary">
                View all
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recommendedCompanies.map((company, index) => (
                <CompanyCard
                  key={company.name}
                  company={company}
                  index={index}
                  onSelect={() => setSelectedCompany(company)}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userName="Alex" currentStreak={7} />

      <main className="flex h-[calc(100vh-73px)]">
        {/* Main timeline area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-8">
            {/* Preparation header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Button
                variant="ghost"
                onClick={() => setSelectedCompany(null)}
                className="mb-4 -ml-2"
              >
                ← Back to Dashboard
              </Button>

              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border border-primary/20 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-xl font-bold text-white">
                        {selectedCompany.logo}
                      </div>
                      <div>
                        <h1 className="font-display text-2xl font-bold text-foreground">
                          {selectedCompany.name}
                        </h1>
                        <p className="text-muted-foreground">
                          {selectedCompany.role}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3">
                      Your 14-day preparation roadmap • {overallProgress}% complete
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-display font-bold text-foreground">
                      {completedTasks}/{totalTasks}
                    </div>
                    <p className="text-sm text-muted-foreground">tasks completed</p>
                  </div>
                </div>

                {/* Overall progress bar */}
                <div className="mt-4">
                  <div className="h-3 bg-background rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${overallProgress}%` }}
                      className="h-full gradient-progress rounded-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Weak areas notification */}
            {weakAreas.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl bg-warning/10 border border-warning/30"
              >
                <div className="flex items-center gap-2 text-warning font-medium">
                  <Sparkles className="w-4 h-4" />
                  Roadmap Recalibrated
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Based on your assessment, we've highlighted {weakAreas.join(", ")} topics for
                  extra focus tomorrow.
                </p>
              </motion.div>
            )}

            {/* Daily timeline */}
            <div className="space-y-4">
              {days.map((day, index) => (
                <DayTimeline
                  key={day.day}
                  day={day.day}
                  date={day.date}
                  tasks={day.tasks}
                  isToday={index === 0}
                  isMilestone={day.day === 7 || day.day === 14}
                  onTaskToggle={handleTaskToggle}
                  onAssessmentComplete={handleAssessmentComplete}
                />
              ))}
            </div>

            <Button
              onClick={handleGenerateRoadmap}
              className="mt-4"
            >
              Generate Roadmap
            </Button>
          </div>
        </div>

        {/* Resume analysis sidebar */}
        <aside className="w-96 border-l border-border bg-card hidden lg:block">
          <ResumeAnalysis
            targetRole={selectedCompany.role}
            items={resumeAnalysisItems}
            overallScore={72}
          />
        </aside>
      </main>
    </div>
  );
}

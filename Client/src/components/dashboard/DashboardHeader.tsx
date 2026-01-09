import { motion } from "framer-motion";
import { Bell, Settings, User, Calendar, Flame } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DashboardHeaderProps {
  userName: string;
  currentStreak: number;
}

export function DashboardHeader({ userName, currentStreak }: DashboardHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Logo />

          <div className="flex items-center gap-4">
            {/* Streak indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
              <Flame className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">
                {currentStreak} day streak
              </span>
            </div>

            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>

            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>

            <Avatar className="h-9 w-9 border-2 border-primary/20">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

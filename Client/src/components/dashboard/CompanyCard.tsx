import { motion } from "framer-motion";
import { Building2, MapPin, Users, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CompanyCardProps {
  company: {
    name: string;
    logo: string;
    location: string;
    role: string;
    matchScore: number;
    employees: string;
    tags: string[];
  };
  index: number;
  onSelect: () => void;
}

export function CompanyCard({ company, index, onSelect }: CompanyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-xl font-bold text-primary">
            {company.logo}
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground">
              {company.name}
            </h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {company.location}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-success/10 text-success text-sm font-medium">
          <Star className="w-3 h-3 fill-current" />
          {company.matchScore}%
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Building2 className="w-4 h-4" />
          <span className="font-medium text-foreground">{company.role}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>{company.employees} employees</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {company.tags.map((tag) => (
          <Badge
            key={tag}
            variant="outline"
            className="text-xs bg-muted/50 border-muted text-muted-foreground"
          >
            {tag}
          </Badge>
        ))}
      </div>

      <Button
        onClick={onSelect}
        variant="outline"
        className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all"
      >
        Start Preparation
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Button>
    </motion.div>
  );
}

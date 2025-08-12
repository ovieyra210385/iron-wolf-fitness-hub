import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend = "neutral",
  trendValue,
  className,
}: StatCardProps) {
  const trendColors = {
    up: "text-fitness-energy",
    down: "text-destructive",
    neutral: "text-muted-foreground",
  };

  return (
    <div className={cn(
      "rounded-lg border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md",
      "hover:scale-105 hover:shadow-card",
      className
    )}>
      <div className="flex items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium tracking-tight text-muted-foreground">
          {title}
        </h3>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <div className="text-2xl font-bold text-card-foreground">
          {value}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
        )}
        {trendValue && (
          <div className={cn("text-xs font-medium", trendColors[trend])}>
            {trend === "up" && "↗ "}
            {trend === "down" && "↘ "}
            {trendValue}
          </div>
        )}
      </div>
    </div>
  );
}
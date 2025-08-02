import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    direction: "up" | "down" | "stable";
    value: string;
    label: string;
  };
  variant?: "default" | "primary" | "success" | "warning";
  className?: string;
}

export const MetricCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
  className
}: MetricCardProps) => {
  const getTrendIcon = () => {
    switch (trend?.direction) {
      case "up":
        return TrendingUp;
      case "down":
        return TrendingDown;
      default:
        return Minus;
    }
  };

  const getTrendColor = () => {
    switch (trend?.direction) {
      case "up":
        return "text-accent";
      case "down":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case "primary":
        return "text-primary";
      case "success":
        return "text-accent";
      case "warning":
        return "text-warning";
      default:
        return "text-muted-foreground";
    }
  };

  const TrendIcon = getTrendIcon();

  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Icon className={cn("h-4 w-4", getIconColor())} />
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{value}</p>
              {subtitle && (
                <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
              )}
            </div>
          </div>
          
          {trend && (
            <Badge variant="outline" className="flex items-center gap-1">
              <TrendIcon className={cn("h-3 w-3", getTrendColor())} />
              <span className={cn("text-xs", getTrendColor())}>{trend.value}</span>
            </Badge>
          )}
        </div>
        
        {trend && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">{trend.label}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
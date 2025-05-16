
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const DashboardCard = ({
  title,
  value,
  icon,
  description,
  trend,
  className,
}: DashboardCardProps) => {
  return (
    <div
      className={cn(
        "glass-card rounded-xl p-6 card-transition",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="mt-2 text-3xl font-semibold tracking-tight">{value}</h3>
          
          {trend && (
            <div className="mt-2 flex items-center">
              <span
                className={cn(
                  "text-xs font-medium",
                  trend.isPositive ? "text-green-600" : "text-red-600"
                )}
              >
                {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
              </span>
              <span className="ml-2 text-xs text-muted-foreground">vs last month</span>
            </div>
          )}
          
          {description && (
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        
        <div className="rounded-full p-2 bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;

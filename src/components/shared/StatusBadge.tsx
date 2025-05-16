
import { cn } from "@/lib/utils";

type StatusType = "success" | "warning" | "error" | "info" | "default";

interface StatusBadgeProps {
  status: StatusType;
  text: string;
  className?: string;
}

const StatusBadge = ({ status, text, className }: StatusBadgeProps) => {
  const getStatusStyles = (): string => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800 border-green-200";
      case "warning":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "error":
        return "bg-red-100 text-red-800 border-red-200";
      case "info":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        getStatusStyles(),
        className
      )}
    >
      {text}
    </span>
  );
};

export default StatusBadge;

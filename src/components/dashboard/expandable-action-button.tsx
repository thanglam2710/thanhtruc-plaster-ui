"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExpandableActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: "default" | "ghost" | "destructive" | "outline";
  iconClassName?: string;
}

export function ExpandableActionButton({
  icon: Icon,
  label,
  onClick,
  variant = "ghost",
  iconClassName,
}: ExpandableActionButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    if (isExpanded) {
      // Second click - execute action
      onClick();
      setIsExpanded(false);
    } else {
      // First click - expand to show label
      setIsExpanded(true);
    }
  };

  return (
    <Button
      size="sm"
      variant={variant}
      onClick={handleClick}
      className={cn(
        "relative overflow-hidden transition-all duration-300 ease-in-out border",
        isExpanded ? "w-auto px-3" : "w-9 px-0",
        isExpanded && "border-border bg-accent/50"
      )}
    >
      <div className="flex items-center gap-2 whitespace-nowrap">
        <Icon className={cn("h-4 w-4 shrink-0", iconClassName)} />
        <span
          className={cn(
            "transition-all duration-300 ease-in-out",
            isExpanded ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0 overflow-hidden"
          )}
        >
          {label}
        </span>
      </div>
    </Button>
  );
}

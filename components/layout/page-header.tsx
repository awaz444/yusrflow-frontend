import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  icon?: LucideIcon;
  children?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, actions, icon: Icon, children, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center sm:justify-between items-start gap-4 mb-6 md:mb-8", className)}>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-8 h-8 text-accent mr-1" />}
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
        </div>
        {description && <p className="text-muted-foreground text-sm md:text-base">{description}</p>}
      </div>
      {(actions || children) && (
        <div className="flex items-center gap-2">
          {actions || children}
        </div>
      )}
    </div>
  );
}

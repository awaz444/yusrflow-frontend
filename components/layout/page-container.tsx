import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/ui/fade-in";

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function PageContainer({ children, className, ...props }: PageContainerProps) {
  return (
    <FadeIn direction="up" className={cn("max-w-7xl mx-auto w-full p-4 md:p-6 lg:p-8", className)}>
      <div {...props}>
        {children}
      </div>
    </FadeIn>
  );
}

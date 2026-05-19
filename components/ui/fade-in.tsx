"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
  fullWidth?: boolean;
}

export function FadeIn({
  children,
  delay = 0,
  direction = "up",
  className = "",
  fullWidth,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);

  const getInitialTransform = () => {
    switch (direction) {
      case "up":    return "translateY(40px)";
      case "down":  return "translateY(-40px)";
      case "left":  return "translateX(40px)";
      case "right": return "translateX(-40px)";
      default:      return "none";
    }
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect prefers-reduced-motion — skip animation entirely
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.opacity = "1";
      el.style.transform = "none";
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transition = `opacity 0.5s ease-out ${delay}s, transform 0.5s ease-out ${delay}s`;
          el.style.opacity = "1";
          el.style.transform = "none";
          observer.disconnect();
        }
      },
      { rootMargin: "-100px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      style={{
        opacity: 0,
        transform: getInitialTransform(),
        willChange: "opacity, transform",
      }}
      className={`${fullWidth ? "w-full" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

/* ---- Stagger helpers (unchanged API, no framer-motion) ---- */

interface StaggerContainerProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function StaggerContainer({
  children,
  delay = 0,
  className = "",
}: StaggerContainerProps) {
  return (
    <div className={className} style={{ transitionDelay: `${delay}s` }}>
      {children}
    </div>
  );
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

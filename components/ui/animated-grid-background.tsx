"use client"

import { cn } from "@/lib/utils"

export function AnimatedGridBackground({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "fixed inset-0 -z-50 overflow-hidden bg-black pointer-events-none",
        className
      )}
      style={{ transform: "translateZ(0)" }}
      aria-hidden="true"
    >
      {/* Grid Pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right,#8080801a 1px,transparent 1px),linear-gradient(to bottom,#8080801a 1px,transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Radial Gradient Mask */}
      <div
        className="absolute inset-0 bg-black"
        style={{
          maskImage:
            "radial-gradient(ellipse 60% 50% at 50% 0%,transparent 70%,#000 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 50% at 50% 0%,transparent 70%,#000 100%)",
        }}
      />

      {/* CSS-only animated blobs — runs on compositor thread, zero JS TBT */}
      <div
        className="landing-blob-1 absolute -top-[20%] -left-[10%] h-[600px] w-[600px] rounded-full bg-primary/30"
        style={{
          filter: "blur(100px)",
          willChange: "transform, opacity",
          animation: "blobFloat1 10s ease-in-out infinite",
        }}
      />
      <div
        className="landing-blob-2 absolute top-[20%] right-[10%] h-[500px] w-[500px] rounded-full bg-blue-500/20"
        style={{
          filter: "blur(120px)",
          willChange: "transform, opacity",
          animation: "blobFloat2 15s ease-in-out 2s infinite",
        }}
      />
      <div
        className="landing-blob-3 absolute bottom-[10%] left-[20%] h-[700px] w-[700px] rounded-full bg-indigo-500/20"
        style={{
          filter: "blur(120px)",
          willChange: "transform, opacity",
          animation: "blobFloat3 12s ease-in-out 5s infinite",
        }}
      />

      <style>{`
        @keyframes blobFloat1 {
          0%,100% { transform:translate(0,0) scale(1);   opacity:0.5; }
          50%      { transform:translate(150px,100px) scale(1.2); opacity:0.8; }
        }
        @keyframes blobFloat2 {
          0%,100% { transform:translate(0,0) scale(1);    opacity:0.4; }
          50%      { transform:translate(-100px,150px) scale(1.1); opacity:0.6; }
        }
        @keyframes blobFloat3 {
          0%,100% { transform:translate(0,0) scale(1);   opacity:0.3; }
          50%      { transform:translate(100px,-50px) scale(1.3); opacity:0.5; }
        }
        @media (prefers-reduced-motion: reduce) {
          .landing-blob-1,.landing-blob-2,.landing-blob-3 { animation:none !important; }
        }
      `}</style>
    </div>
  )
}

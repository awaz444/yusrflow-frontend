"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function AnimatedGridBackground({ className }: { className?: string }) {
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px), (prefers-reduced-motion: reduce)")
    const update = () => setReduceMotion(media.matches)

    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  return (
    <div className={cn("fixed inset-0 -z-50 overflow-hidden bg-black pointer-events-none [transform:translateZ(0)]", className)}>
      {/* Grid Pattern */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] bg-[size:24px_24px]"
      />

      {/* Radial Gradient Mask for Grid - makes it fade out at edges */}
      <div className="absolute inset-0 bg-black [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,transparent_70%,#000_100%)]" />

      {/* On mobile/reduced-motion, keep static blobs to avoid GPU flicker. */}
      {reduceMotion ? (
        <>
          <div className="absolute -top-[20%] -left-[10%] h-[520px] w-[520px] rounded-full bg-primary/25 blur-[90px]" />
          <div className="absolute top-[20%] right-[10%] h-[420px] w-[420px] rounded-full bg-blue-500/15 blur-[100px]" />
          <div className="absolute bottom-[10%] left-[20%] h-[560px] w-[560px] rounded-full bg-indigo-500/15 blur-[100px]" />
        </>
      ) : (
        <>
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
              x: [0, 150, 0],
              y: [0, 100, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-[20%] -left-[10%] h-[600px] w-[600px] rounded-full bg-primary/30 blur-[100px]"
          />

          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.4, 0.6, 0.4],
              x: [0, -100, 0],
              y: [0, 150, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute top-[20%] right-[10%] h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-[120px]"
          />

          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3],
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 5,
            }}
            className="absolute bottom-[10%] left-[20%] h-[700px] w-[700px] rounded-full bg-indigo-500/20 blur-[120px]"
          />
        </>
      )}
    </div>
  )
}

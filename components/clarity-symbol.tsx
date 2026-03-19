"use client"

import { motion } from "framer-motion"

export function ClaritySymbol({
  isBlurring = false,
  step = 0,
  size = 16,
}: {
  isBlurring?: boolean
  step?: number
  size?: number
}) {
  const r = 6
  const circumference = 2 * Math.PI * r
  const dashArray = (step / 6) * circumference

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      className={isBlurring ? "shrink-0 clarity-symbol-blurring" : "shrink-0"}
    >
      {/* Track */}
      <circle cx="8" cy="8" r={r} stroke="#FFAA80" strokeWidth="1.5" opacity={0.35} />
      {/* Progress arc */}
      <motion.circle
        cx="8"
        cy="8"
        r={r}
        stroke="#FF6B35"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={circumference}
        transform="rotate(-90 8 8)"
        animate={{ strokeDashoffset: circumference - dashArray }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      />
    </svg>
  )
}

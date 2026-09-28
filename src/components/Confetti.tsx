"use client";

import { motion } from "framer-motion";

const COLORS = ["#f43f7d", "#e0ac4d", "#22c55e", "#60a5fa", "#c98a2c", "#e11d67"];

export default function Confetti() {
  const pieces = Array.from({ length: 40 });
  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {pieces.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.6;
        const duration = 2.2 + Math.random() * 1.4;
        const color = COLORS[i % COLORS.length];
        const size = 6 + Math.random() * 6;
        return (
          <motion.span
            key={i}
            initial={{ y: -40, x: 0, opacity: 1, rotate: 0 }}
            animate={{ y: "110vh", x: (Math.random() - 0.5) * 200, rotate: 360 }}
            transition={{ duration, delay, ease: "easeIn" }}
            style={{
              position: "absolute",
              left: `${left}%`,
              top: 0,
              width: size,
              height: size * 1.6,
              background: color,
              borderRadius: 2,
            }}
          />
        );
      })}
    </div>
  );
}

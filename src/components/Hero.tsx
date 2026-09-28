"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import type { Occasion } from "@/lib/types";

const FLOATERS = ["🎁", "🎈", "💐", "🎂", "✨", "🎉"];

export default function Hero({ occasions }: { occasions: Occasion[] }) {
  const slides = occasions.slice(0, 6);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((v) => (v + 1) % slides.length), 4000);
    return () => clearInterval(id);
  }, [slides.length]);

  const current = slides[active];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-rose-50 via-cream-50 to-cream-50">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {FLOATERS.map((emoji, i) => (
          <motion.span
            key={i}
            className="absolute text-2xl sm:text-3xl opacity-40"
            style={{ left: `${8 + i * 16}%`, top: `${10 + (i % 3) * 22}%` }}
            animate={{ y: [0, -18, 0], rotate: [0, 8, 0] }}
            transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
          >
            {emoji}
          </motion.span>
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-16 sm:pt-20 sm:pb-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-medium text-rose-600 shadow-sm"
            >
              <Sparkles size={14} /> Handpicked gifts, delivered with love
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.08] text-ink-900"
            >
              A perfect gift for
              <br />
              <AnimatePresence mode="wait">
                <motion.span
                  key={current?.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                  className="shimmer-text italic font-display"
                >
                  {current?.name ?? "every occasion"}
                </motion.span>
              </AnimatePresence>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-5 max-w-md text-base text-ink-900/60"
            >
              From birthdays to boardrooms, weddings to festivals — explore thoughtfully
              curated gifts for every celebration, all in one place.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 rounded-full bg-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-600/25 transition-all hover:bg-rose-700 hover:shadow-rose-600/40"
              >
                Explore All Gifts
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href={current ? `/occasions/${current.slug}` : "/products"}
                className="inline-flex items-center gap-2 rounded-full border border-ink-900/10 bg-white px-6 py-3 text-sm font-semibold text-ink-900 transition-all hover:border-rose-200 hover:text-rose-600"
              >
                Shop {current?.name}
              </Link>
            </motion.div>

            <div className="mt-8 flex gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setActive(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === active ? "w-8 bg-rose-600" : "w-2 bg-rose-200"
                  }`}
                  aria-label={`Show ${s.name}`}
                />
              ))}
            </div>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-md">
            <AnimatePresence mode="wait">
              <motion.div
                key={current?.id}
                initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-4 overflow-hidden rounded-[2.5rem] shadow-2xl shadow-rose-900/20"
              >
                {current && (
                  <Image
                    src={current.image}
                    alt={current.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 80vw, 480px"
                    className="object-cover"
                  />
                )}
                <div
                  className="absolute inset-0 mix-blend-multiply opacity-30"
                  style={{
                    background: `linear-gradient(135deg, ${current?.fromColor}, ${current?.toColor})`,
                  }}
                />
              </motion.div>
            </AnimatePresence>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-4 top-6 rounded-2xl bg-white px-4 py-3 shadow-xl"
            >
              <p className="text-xs text-ink-900/40">Same-day delivery</p>
              <p className="text-sm font-semibold text-rose-600">In select cities</p>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-4 bottom-8 rounded-2xl bg-white px-4 py-3 shadow-xl"
            >
              <p className="text-xs text-ink-900/40">Rated 4.8/5</p>
              <p className="text-sm font-semibold text-gold-600">by 12,000+ gifters</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

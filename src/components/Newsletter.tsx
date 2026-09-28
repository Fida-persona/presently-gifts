"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Check } from "lucide-react";
import RevealOnScroll from "./RevealOnScroll";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
      <RevealOnScroll>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-600 to-rose-500 px-6 py-14 text-center sm:px-16">
          <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -right-10 -bottom-10 h-52 w-52 rounded-full bg-white/10" />
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white">
            Never miss an occasion
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-white/80">
            Subscribe for gift reminders, curated picks, and early access to seasonal offers.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto mt-6 flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-rose-600"
            >
              <Check size={16} /> You&apos;re on the list!
            </motion.div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email) setSubmitted(true);
              }}
              className="mx-auto mt-6 flex max-w-md items-center gap-2"
            >
              <div className="relative flex-1">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-900/30" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-full border-0 py-3 pl-10 pr-4 text-sm outline-none ring-2 ring-transparent focus:ring-white/50"
                />
              </div>
              <button
                type="submit"
                className="shrink-0 rounded-full bg-ink-900 px-5 py-3 text-sm font-semibold text-white transition-transform hover:scale-105"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </RevealOnScroll>
    </section>
  );
}

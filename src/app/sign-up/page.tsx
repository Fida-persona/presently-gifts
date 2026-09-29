"use client";

import { useActionState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Gift, Lock, Mail, User } from "lucide-react";
import { signUpAction } from "@/lib/actions";

function SignUpForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";
  const [state, formAction, pending] = useActionState(signUpAction, undefined);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-sm rounded-3xl border border-rose-100 bg-white p-8 shadow-xl shadow-rose-900/5"
    >
      <div className="flex flex-col items-center text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-gold-500 text-white">
          <Gift size={22} />
        </span>
        <h1 className="mt-4 font-display text-xl font-semibold text-ink-900">Create an account</h1>
        <p className="mt-1 text-sm text-ink-900/50">Just a few details to get your gift moving</p>
      </div>

      <form action={formAction} className="mt-6 space-y-4">
        <input type="hidden" name="next" value={next} />
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-900/60">Full Name</label>
          <div className="relative">
            <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-900/30" />
            <input
              type="text"
              name="name"
              required
              autoFocus
              className="w-full rounded-xl border border-rose-100 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-900/60">Email</label>
          <div className="relative">
            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-900/30" />
            <input
              type="email"
              name="email"
              required
              className="w-full rounded-xl border border-rose-100 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-900/60">Password</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-900/30" />
            <input
              type="password"
              name="password"
              required
              minLength={6}
              className="w-full rounded-xl border border-rose-100 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
            />
          </div>
          <p className="mt-1 text-[11px] text-ink-900/35">At least 6 characters</p>
        </div>

        {state?.error && (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-600">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-rose-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-rose-700 disabled:opacity-60"
        >
          {pending ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-ink-900/60">
        Already have an account?{" "}
        <Link href={`/sign-in?next=${encodeURIComponent(next)}`} className="font-medium text-rose-600 hover:underline">
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}

export default function SignUpPage() {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-gradient-to-br from-rose-50 via-cream-50 to-cream-50 px-4">
      <Suspense fallback={null}>
        <SignUpForm />
      </Suspense>
    </div>
  );
}

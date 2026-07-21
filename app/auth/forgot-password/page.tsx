"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { forgotPasswordSchema, ForgotPasswordInput } from "@/lib/validations/auth";
import { Sparkles, KeyRound, Mail, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        toast.error(result.message || "Failed to process request");
        setIsLoading(false);
        return;
      }

      toast.success(result.message);
      if (result.data?.resetToken) {
        setResetToken(result.data.resetToken);
      }
      setIsLoading(false);
    } catch (error) {
      toast.error("Network error during password reset request");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 p-4 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full glass-card p-8 rounded-3xl border border-slate-800 shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-xl gradient-bg flex items-center justify-center text-white shadow-lg">
              <Sparkles className="h-5 w-5" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight">Forgot Password</h1>
          <p className="text-sm text-slate-400 mt-1">
            Enter your registered email address to receive a reset token
          </p>
        </div>

        {resetToken ? (
          <div className="space-y-4 text-center">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 shrink-0" />
              <div className="text-left text-xs">
                <span className="font-bold text-sm block">Reset Token Generated!</span>
                Use this token to reset your password.
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-indigo-400 break-all select-all">
              {resetToken}
            </div>
            <Link
              href={`/auth/reset-password?token=${resetToken}`}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl gradient-bg text-white font-semibold text-sm shadow-lg hover:opacity-95 transition-all"
            >
              Proceed to Reset Password
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Registered Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="alex@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-white placeholder-slate-500 outline-none transition-all"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-400 mt-1">{errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl gradient-bg text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating Token...
                </>
              ) : (
                <>
                  <KeyRound className="h-4 w-4" />
                  Send Reset Instructions
                </>
              )}
            </button>
          </form>
        )}

        <div className="text-center mt-6 text-sm text-slate-400">
          <Link href="/auth/login" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

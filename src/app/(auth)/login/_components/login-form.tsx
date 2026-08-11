// app/(auth)/login/_components/login-form.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";
import { useAuth } from "@/app/(auth)/context/auth-context";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Login failed. Please try again.";
}

export function LoginForm() {
  const { login, loginWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setBannerError(null);
    setIsSubmitting(true);

    try {
      await login(values.email, values.password);
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      const lowerMessage = message.toLowerCase();

      if (lowerMessage.includes("email") || lowerMessage.includes("account")) {
        setError("email", { type: "server", message });
      } else if (
        lowerMessage.includes("password") ||
        lowerMessage.includes("invalid")
      ) {
        setError("password", { type: "server", message });
      } else {
        setBannerError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setBannerError(null);
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch (error: unknown) {
      setBannerError(getErrorMessage(error));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {bannerError && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-900/15 bg-red-50/80 p-4">
            <AlertCircle
              className="mt-0.5 size-5 shrink-0 text-red-700"
              strokeWidth={1.5}
            />
            <p className="text-sm leading-relaxed text-red-800">{bannerError}</p>
          </div>
        )}

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-stone-900"
          >
            Email address
          </label>
          <div className="relative">
            <Mail
              className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-stone-400"
              strokeWidth={1.5}
            />
            <input
              id="email"
              {...register("email")}
              type="email"
              placeholder="name@dormly.edu"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              className={`h-14 w-full rounded-2xl border bg-white pl-12 pr-4 text-base font-medium text-stone-950 shadow-sm outline-none transition placeholder:font-normal placeholder:text-stone-400 focus:bg-white focus:ring-2 focus:ring-[#c3a26c]/30 ${
                errors.email
                  ? "border-red-400 focus:border-red-500"
                  : "border-stone-200 focus:border-[#c3a26c]"
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-700">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-stone-900"
          >
            Password
          </label>
          <div className="relative">
            <Lock
              className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-stone-400"
              strokeWidth={1.5}
            />
            <input
              id="password"
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              autoComplete="current-password"
              aria-invalid={Boolean(errors.password)}
              className={`h-14 w-full rounded-2xl border bg-white pl-12 pr-12 text-base font-medium text-stone-950 shadow-sm outline-none transition placeholder:font-normal placeholder:text-stone-400 focus:bg-white focus:ring-2 focus:ring-[#c3a26c]/30 ${
                errors.password
                  ? "border-red-400 focus:border-red-500"
                  : "border-stone-200 focus:border-[#c3a26c]"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-100 hover:text-stone-950"
            >
              {showPassword ? (
                <EyeOff className="size-4" strokeWidth={1.5} />
              ) : (
                <Eye className="size-4" strokeWidth={1.5} />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-700">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isGoogleLoading}
          className="group flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-stone-950 px-5 text-base font-semibold text-white shadow-lg transition hover:bg-stone-800 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" strokeWidth={1.5} />
              Signing in...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-1"
                strokeWidth={1.5}
              />
            </>
          )}
        </button>
      </form>

      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-stone-200" />
        </div>
        <div className="relative bg-white px-3 text-xs font-semibold uppercase tracking-wider text-stone-400">
          Or continue with
        </div>
      </div>

      {/* Google Login Button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isSubmitting || isGoogleLoading}
        className="flex h-14 w-full items-center justify-center gap-3 rounded-full border border-stone-200 bg-white px-5 text-sm font-semibold text-stone-700 shadow-sm transition hover:bg-stone-50 hover:border-stone-300 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
      >
        {isGoogleLoading ? (
          <>
            <Loader2 className="size-4 animate-spin text-stone-600" />
            Connecting Google...
          </>
        ) : (
          <>
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Sign In with Google
          </>
        )}
      </button>
    </div>
  );
}
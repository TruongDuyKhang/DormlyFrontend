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
  const { login } = useAuth(); // Lấy login từ context
  const [showPassword, setShowPassword] = useState(false);
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      // Gọi login từ context - nó sẽ tự xử lý:
      // 1. Gọi API
      // 2. Lưu token
      // 3. Set user state
      // 4. Redirect (thông qua useEffect trong AuthProvider)
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
          className="block text-base font-semibold text-stone-900"
        >
          Email address
        </label>
        <div className="relative">
          <Mail
            className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-stone-400"
            strokeWidth={1.5}
          />
          <input
            id="email"
            {...register("email")}
            type="email"
            placeholder="student@gmail.com"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            className={`h-16 w-full rounded-[1.35rem] border bg-white pl-14 pr-5 text-base font-medium text-stone-950 shadow-[0_18px_56px_-34px_rgba(28,25,23,0.92)] outline-none transition placeholder:font-normal placeholder:text-stone-400 focus:bg-white focus:shadow-[0_22px_72px_-34px_rgba(28,25,23,0.95)] ${
              errors.email
                ? "border-red-400 focus:border-red-500"
                : "border-stone-950/18 focus:border-stone-950/55"
            }`}
          />
        </div>
        {errors.email && (
          <p className="text-sm text-red-700">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-base font-semibold text-stone-900"
        >
          Password
        </label>
        <div className="relative">
          <Lock
            className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-stone-400"
            strokeWidth={1.5}
          />
          <input
            id="password"
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
            className={`h-16 w-full rounded-[1.35rem] border bg-white pl-14 pr-14 text-base font-medium text-stone-950 shadow-[0_18px_56px_-34px_rgba(28,25,23,0.92)] outline-none transition placeholder:font-normal placeholder:text-stone-400 focus:bg-white focus:shadow-[0_22px_72px_-34px_rgba(28,25,23,0.95)] ${
              errors.password
                ? "border-red-400 focus:border-red-500"
                : "border-stone-950/18 focus:border-stone-950/55"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-4 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-950/5 hover:text-stone-950"
          >
            {showPassword ? (
              <EyeOff className="size-4" strokeWidth={1.5} />
            ) : (
              <Eye className="size-4" strokeWidth={1.5} />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-700">{errors.password.message}</p>
        )}
      </div>

      {/* Demo credentials hint */}
      <div className="rounded-xl bg-stone-50 p-3 text-center">
        <p className="text-xs text-stone-500">Demo accounts:</p>
        <div className="mt-1 flex flex-wrap justify-center gap-3 text-xs">
          <span className="font-mono text-stone-600">
            student@gmail.com / student
          </span>
          <span className="text-stone-300">|</span>
          <span className="font-mono text-stone-600">
            admin@gmail.com / admin1
          </span>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="group flex h-16 w-full items-center justify-center gap-3 rounded-full bg-stone-950 px-5 text-base font-semibold text-white shadow-[0_28px_80px_-34px_rgba(0,0,0,0.92)] transition hover:bg-stone-800 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" strokeWidth={1.5} />
            Signing in
          </>
        ) : (
          <>
            Sign in
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-1"
              strokeWidth={1.5}
            />
          </>
        )}
      </button>
    </form>
  );
}
// app/(auth)/change-password/_components/change-password-form.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowRight, Eye, EyeOff, Loader2, Lock, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password must be at least 6 characters."),
    newPassword: z.string().min(6, "New password must be at least 6 characters."),
    confirmPassword: z.string().min(6, "Please confirm your new password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password.",
    path: ["newPassword"],
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Password change failed. Please try again.";
}

export function ChangePasswordForm() {
  const router = useRouter();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const mockChangePassword = async (currentPassword: string, newPassword: string) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    if (currentPassword !== "password123") {
      throw new Error("Current password is incorrect.");
    }
    
    return true;
  };

  const onSubmit = async (values: ChangePasswordFormValues) => {
    setBannerError(null);
    setIsSubmitting(true);

    try {
      await mockChangePassword(values.currentPassword, values.newPassword);
      setIsSuccess(true);
      
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      const lowerMessage = message.toLowerCase();

      if (lowerMessage.includes("current password")) {
        setError("currentPassword", { type: "server", message });
      } else if (lowerMessage.includes("match")) {
        setError("confirmPassword", { type: "server", message });
      } else {
        setBannerError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center space-y-3 py-4">
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle className="h-6 w-6 text-emerald-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-stone-900">Password changed!</h3>
        <p className="text-sm text-stone-600">
          Your password has been updated successfully.
        </p>
        <p className="text-xs text-stone-500">
          Redirecting to login page...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {bannerError && (
        <div className="flex items-start gap-2 rounded-xl border border-red-900/15 bg-red-50/80 p-3">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-700" strokeWidth={1.5} />
          <p className="text-xs leading-relaxed text-red-800">{bannerError}</p>
        </div>
      )}

      {/* Current Password */}
      <div className="space-y-1.5">
        <label htmlFor="currentPassword" className="block text-sm font-semibold text-stone-900">
          Current Password
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400" strokeWidth={1.5} />
          <input
            id="currentPassword"
            {...register("currentPassword")}
            type={showCurrentPassword ? "text" : "password"}
            placeholder="Enter your current password"
            autoComplete="current-password"
            aria-invalid={Boolean(errors.currentPassword)}
            className={`h-12 w-full rounded-xl border bg-white pl-11 pr-11 text-sm font-medium text-stone-950 shadow-sm outline-none transition placeholder:font-normal placeholder:text-stone-400 focus:bg-white focus:shadow-md ${
              errors.currentPassword
                ? "border-red-400 focus:border-red-500"
                : "border-stone-200 focus:border-stone-400"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword((value) => !value)}
            className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-100"
          >
            {showCurrentPassword ? <EyeOff className="size-3.5" strokeWidth={1.5} /> : <Eye className="size-3.5" strokeWidth={1.5} />}
          </button>
        </div>
        {errors.currentPassword && (
          <p className="text-xs text-red-700">{errors.currentPassword.message}</p>
        )}
      </div>

      {/* New Password */}
      <div className="space-y-1.5">
        <label htmlFor="newPassword" className="block text-sm font-semibold text-stone-900">
          New Password
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400" strokeWidth={1.5} />
          <input
            id="newPassword"
            {...register("newPassword")}
            type={showNewPassword ? "text" : "password"}
            placeholder="Enter new password"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.newPassword)}
            className={`h-12 w-full rounded-xl border bg-white pl-11 pr-11 text-sm font-medium text-stone-950 shadow-sm outline-none transition placeholder:font-normal placeholder:text-stone-400 focus:bg-white focus:shadow-md ${
              errors.newPassword
                ? "border-red-400 focus:border-red-500"
                : "border-stone-200 focus:border-stone-400"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowNewPassword((value) => !value)}
            className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-100"
          >
            {showNewPassword ? <EyeOff className="size-3.5" strokeWidth={1.5} /> : <Eye className="size-3.5" strokeWidth={1.5} />}
          </button>
        </div>
        {errors.newPassword && (
          <p className="text-xs text-red-700">{errors.newPassword.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-stone-900">
          Confirm New Password
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400" strokeWidth={1.5} />
          <input
            id="confirmPassword"
            {...register("confirmPassword")}
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your new password"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.confirmPassword)}
            className={`h-12 w-full rounded-xl border bg-white pl-11 pr-11 text-sm font-medium text-stone-950 shadow-sm outline-none transition placeholder:font-normal placeholder:text-stone-400 focus:bg-white focus:shadow-md ${
              errors.confirmPassword
                ? "border-red-400 focus:border-red-500"
                : "border-stone-200 focus:border-stone-400"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((value) => !value)}
            className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-100"
          >
            {showConfirmPassword ? <EyeOff className="size-3.5" strokeWidth={1.5} /> : <Eye className="size-3.5" strokeWidth={1.5} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-red-700">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Password Requirements - Thu nhỏ */}
      <div className="rounded-lg bg-stone-50 p-3">
        <ul className="space-y-0.5 text-xs text-stone-500">
          <li>• At least 6 characters long</li>
        </ul>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="group flex h-12 w-full items-center justify-center gap-2 rounded-full bg-stone-950 px-4 text-sm font-semibold text-white shadow-md transition hover:bg-stone-800 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-3.5 animate-spin" strokeWidth={1.5} />
            Updating password...
          </>
        ) : (
          <>
            Change Password
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
          </>
        )}
      </button>
    </form>
  );
}
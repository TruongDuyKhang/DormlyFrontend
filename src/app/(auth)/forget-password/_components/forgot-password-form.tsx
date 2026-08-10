"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle,
  ArrowLeft,
  EyeOff,
  Eye,
} from "lucide-react";
import { forgotPasswordService } from "../services/forgotPasswordService";
import { toast } from "sonner";

// Step 1
const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});
type EmailFormValues = z.infer<typeof emailSchema>;

// Step 2
const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits."),
});
type OtpFormValues = z.infer<typeof otpSchema>;

// Step 3
const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string().min(6, "Please confirm your password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

type Step = "email" | "otp" | "reset";

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? "Something went wrong. Please try again.";
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

export function ForgotPasswordForm() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm<EmailFormValues>({ resolver: zodResolver(emailSchema) });

  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
  } = useForm<OtpFormValues>({ resolver: zodResolver(otpSchema) });

  const {
    register: registerReset,
    handleSubmit: handleResetSubmit,
    formState: { errors: resetErrors },
  } = useForm<ResetPasswordFormValues>({ resolver: zodResolver(resetPasswordSchema) });

  const startCountdown = (seconds: number) => {
    setCountdown(seconds);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Step 1: gửi OTP
  const onSendOtp = async (values: EmailFormValues) => {
    setIsSubmitting(true);
    try {
      await forgotPasswordService.sendCode({ email: values.email });
      setEmail(values.email);
      toast.success(`Verification code sent to ${values.email}`);
      setStep("otp");
      startCountdown(60);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: lưu OTP
  const onVerifyOtp = (values: OtpFormValues) => {
    setCode(values.otp);
    toast.success("Code verified. Set your new password.");
    setStep("reset");
  };

  // Step 3: reset password với email + code + newPassword + confirmPassword
  const onResetPassword = async (values: ResetPasswordFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await forgotPasswordService.resetPassword({
        email,
        code,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });

      toast.success(res.message ?? "Password reset successful. Redirecting...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1800);
    } catch (error: unknown) {
      const errorMsg = getErrorMessage(error);
      toast.error(errorMsg);
      setStep("otp");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resend
  const onResendOtp = async () => {
    if (countdown > 0) return;
    try {
      await forgotPasswordService.sendCode({ email });
      toast.success(`New verification code sent to ${email}`);
      startCountdown(60);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    }
  };

  // Back
  const goBack = () => {
    if (step === "otp") setStep("email");
    if (step === "reset") setStep("otp");
  };

  const inputClass = (hasError: boolean) =>
    `h-14 w-full rounded-[1.35rem] border bg-white pl-12 pr-4 text-sm font-medium text-stone-950 shadow-[0_18px_56px_-34px_rgba(28,25,23,0.92)] outline-none transition placeholder:text-stone-400 ${
      hasError
        ? "border-red-400 focus:border-red-500"
        : "border-stone-950/15 focus:border-stone-950/45"
    }`;

  return (
    <div className="space-y-4">
      {step === "email" && (
        <form onSubmit={handleEmailSubmit(onSendOtp)} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-stone-900">Email address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400" strokeWidth={1.5} />
              <input
                {...registerEmail("email")}
                type="email"
                placeholder="student@dormly.edu"
                className={inputClass(Boolean(emailErrors.email))}
              />
            </div>
            {emailErrors.email && <p className="text-xs text-red-700">{emailErrors.email.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="group flex h-14 w-full items-center justify-center gap-2 rounded-full bg-stone-950 px-5 text-sm font-semibold text-white shadow-[0_28px_80px_-34px_rgba(0,0,0,0.92)] transition hover:bg-stone-800 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" strokeWidth={1.5} />
                Sending code
              </>
            ) : (
              <>
                Send verification code
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
              </>
            )}
          </button>
        </form>
      )}

      {step === "otp" && (
        <form onSubmit={handleOtpSubmit(onVerifyOtp)} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-stone-900">Verification code</label>
            <input
              {...registerOtp("otp")}
              type="text"
              maxLength={6}
              placeholder="123456"
              className={`h-14 w-full rounded-[1.35rem] border bg-white px-4 text-center text-lg font-semibold tracking-[0.35em] text-stone-950 shadow-[0_18px_56px_-34px_rgba(28,25,23,0.92)] outline-none transition ${
                otpErrors.otp
                  ? "border-red-400 focus:border-red-500"
                  : "border-stone-950/15 focus:border-stone-950/45"
              }`}
            />
            {otpErrors.otp && <p className="text-xs text-red-700">{otpErrors.otp.message}</p>}
            <p className="text-xs text-stone-500">
              We sent a code to <span className="font-semibold text-stone-700">{email}</span>
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={goBack}
              className="flex h-14 items-center justify-center gap-2 rounded-full border border-stone-200 bg-white px-5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
            >
              <ArrowLeft className="size-4" strokeWidth={1.5} />
              Back
            </button>

            <button
              type="submit"
              className="group flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-stone-950 px-5 text-sm font-semibold text-white shadow-[0_28px_80px_-34px_rgba(0,0,0,0.92)] transition hover:bg-stone-800 active:scale-[0.98]"
            >
              Continue
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={onResendOtp}
              disabled={countdown > 0}
              className="text-sm font-medium text-blue-600 transition hover:text-blue-700 disabled:text-stone-400"
            >
              {countdown > 0 ? `Resend code in ${countdown}s` : "Resend code"}
            </button>
          </div>
        </form>
      )}

      {step === "reset" && (
        <form onSubmit={handleResetSubmit(onResetPassword)} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-stone-900">New password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400" strokeWidth={1.5} />
              <input
                {...registerReset("newPassword")}
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                className={`${inputClass(Boolean(resetErrors.newPassword))} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-950/5"
              >
                {showNewPassword ? <EyeOff className="size-4" strokeWidth={1.5} /> : <Eye className="size-4" strokeWidth={1.5} />}
              </button>
            </div>
            {resetErrors.newPassword && <p className="text-xs text-red-700">{resetErrors.newPassword.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-stone-900">Confirm password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400" strokeWidth={1.5} />
              <input
                {...registerReset("confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                className={`${inputClass(Boolean(resetErrors.confirmPassword))} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-950/5"
              >
                {showConfirmPassword ? <EyeOff className="size-4" strokeWidth={1.5} /> : <Eye className="size-4" strokeWidth={1.5} />}
              </button>
            </div>
            {resetErrors.confirmPassword && <p className="text-xs text-red-700">{resetErrors.confirmPassword.message}</p>}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={goBack}
              className="flex h-14 items-center justify-center gap-2 rounded-full border border-stone-200 bg-white px-5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
            >
              <ArrowLeft className="size-4" strokeWidth={1.5} />
              Back
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-stone-950 px-5 text-sm font-semibold text-white shadow-[0_28px_80px_-34px_rgba(0,0,0,0.92)] transition hover:bg-stone-800 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" strokeWidth={1.5} />
                  Resetting
                </>
              ) : (
                <>
                  Reset password
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
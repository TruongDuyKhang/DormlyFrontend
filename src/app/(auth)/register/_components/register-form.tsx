// app/(auth)/register/components/register-form.tsx
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
  User,
  IdCard,
  Calendar,
  Phone,
} from "lucide-react";

const registerSchema = z
  .object({
    email: z.string().email("Please enter a valid email address."),
    fullName: z.string().min(2, "Full name must be at least 2 characters."),
    studentId: z.string().min(5, "Student ID must be at least 5 characters."),
    dateOfBirth: z.string().min(1, "Please select your date of birth."),
    startYear: z.string().min(4, "Please select start year."),
    endYear: z.string().min(4, "Please select end year."),
    phone: z.string().min(10, "Phone number must be at least 10 digits."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z
      .string()
      .min(6, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Registration failed. Please try again.";
}

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [bannerError, setBannerError] = useState<string | null>(
    null
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentYear = new Date().getFullYear();

  const years = Array.from(
    { length: 10 },
    (_, i) => currentYear - 5 + i
  );

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const mockRegister = async (
    values: RegisterFormValues
  ) => {
    await new Promise((resolve) =>
      setTimeout(resolve, 1000)
    );

    if (
      !values.email.endsWith("@gmail.com") &&
      !values.email.endsWith("@dormly.edu")
    ) {
      throw new Error(
        "Use an approved campus email to continue."
      );
    }
  };

  const onSubmit = async (
    values: RegisterFormValues
  ) => {
    setBannerError(null);
    setIsSubmitting(true);

    try {
      await mockRegister(values);

      window.alert(
        "Registration successful. This is a demo flow."
      );
    } catch (error: unknown) {
      const message = getErrorMessage(error);

      setError("email", {
        type: "server",
        message,
      });

      setBannerError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (hasError: boolean) =>
    `h-12 w-full rounded-2xl border bg-white pl-11 pr-4 text-sm font-medium text-stone-950 shadow-[0_18px_56px_-34px_rgba(28,25,23,0.92)] outline-none transition placeholder:text-stone-400 ${
      hasError
        ? "border-red-400 focus:border-red-500"
        : "border-stone-950/15 focus:border-stone-950/45"
    }`;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-3"
    >
      {bannerError && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-900/15 bg-red-50/80 p-3">
          <AlertCircle
            className="mt-0.5 size-4 shrink-0 text-red-700"
            strokeWidth={1.5}
          />

          <p className="text-xs leading-relaxed text-red-800">
            {bannerError}
          </p>
        </div>
      )}

      {/* Email + Fullname */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-stone-900">
            Email
          </label>

          <div className="relative">
            <Mail
              className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400"
              strokeWidth={1.5}
            />

            <input
              {...register("email")}
              type="email"
              placeholder="student@dormly.edu"
              className={inputClass(Boolean(errors.email))}
            />
          </div>

          {errors.email && (
            <p className="text-xs text-red-700">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-stone-900">
            Full name
          </label>

          <div className="relative">
            <User
              className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400"
              strokeWidth={1.5}
            />

            <input
              {...register("fullName")}
              type="text"
              placeholder="Nguyen Van A"
              className={inputClass(Boolean(errors.fullName))}
            />
          </div>

          {errors.fullName && (
            <p className="text-xs text-red-700">
              {errors.fullName.message}
            </p>
          )}
        </div>
      </div>

      {/* Student ID + DOB */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-stone-900">
            Student ID
          </label>

          <div className="relative">
            <IdCard
              className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400"
              strokeWidth={1.5}
            />

            <input
              {...register("studentId")}
              type="text"
              placeholder="20210001"
              className={inputClass(Boolean(errors.studentId))}
            />
          </div>

          {errors.studentId && (
            <p className="text-xs text-red-700">
              {errors.studentId.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-stone-900">
            Date of birth
          </label>

          <div className="relative">
            <Calendar
              className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400"
              strokeWidth={1.5}
            />

            <input
              {...register("dateOfBirth")}
              type="date"
              className={inputClass(
                Boolean(errors.dateOfBirth)
              )}
            />
          </div>

          {errors.dateOfBirth && (
            <p className="text-xs text-red-700">
              {errors.dateOfBirth.message}
            </p>
          )}
        </div>
      </div>

      {/* Years */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-stone-900">
            Start year
          </label>

          <select
            {...register("startYear")}
            className={`h-12 w-full rounded-2xl border bg-white px-4 text-sm font-medium text-stone-950 shadow-[0_18px_56px_-34px_rgba(28,25,23,0.92)] outline-none transition ${
              errors.startYear
                ? "border-red-400 focus:border-red-500"
                : "border-stone-950/15 focus:border-stone-950/45"
            }`}
          >
            <option value="">Select year</option>

            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          {errors.startYear && (
            <p className="text-xs text-red-700">
              {errors.startYear.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-stone-900">
            End year
          </label>

          <select
            {...register("endYear")}
            className={`h-12 w-full rounded-2xl border bg-white px-4 text-sm font-medium text-stone-950 shadow-[0_18px_56px_-34px_rgba(28,25,23,0.92)] outline-none transition ${
              errors.endYear
                ? "border-red-400 focus:border-red-500"
                : "border-stone-950/15 focus:border-stone-950/45"
            }`}
          >
            <option value="">Select year</option>

            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          {errors.endYear && (
            <p className="text-xs text-red-700">
              {errors.endYear.message}
            </p>
          )}
        </div>
      </div>

      {/* Phone */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-stone-900">
          Phone number
        </label>

        <div className="relative">
          <Phone
            className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400"
            strokeWidth={1.5}
          />

          <input
            {...register("phone")}
            type="tel"
            placeholder="0901 234 567"
            className={inputClass(Boolean(errors.phone))}
          />
        </div>

        {errors.phone && (
          <p className="text-xs text-red-700">
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-stone-900">
            Password
          </label>

          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400"
              strokeWidth={1.5}
            />

            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={`${inputClass(
                Boolean(errors.password)
              )} pr-11`}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword((prev) => !prev)
              }
              className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-950/5"
            >
              {showPassword ? (
                <EyeOff
                  className="size-4"
                  strokeWidth={1.5}
                />
              ) : (
                <Eye
                  className="size-4"
                  strokeWidth={1.5}
                />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="text-xs text-red-700">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-stone-900">
            Confirm
          </label>

          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400"
              strokeWidth={1.5}
            />

            <input
              {...register("confirmPassword")}
              type={
                showConfirmPassword ? "text" : "password"
              }
              placeholder="Confirm"
              className={`${inputClass(
                Boolean(errors.confirmPassword)
              )} pr-11`}
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword((prev) => !prev)
              }
              className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-950/5"
            >
              {showConfirmPassword ? (
                <EyeOff
                  className="size-4"
                  strokeWidth={1.5}
                />
              ) : (
                <Eye
                  className="size-4"
                  strokeWidth={1.5}
                />
              )}
            </button>
          </div>

          {errors.confirmPassword && (
            <p className="text-xs text-red-700">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="group flex h-12 w-full items-center justify-center gap-2 rounded-full bg-stone-950 px-5 text-sm font-semibold text-white shadow-[0_28px_80px_-34px_rgba(0,0,0,0.92)] transition hover:bg-stone-800 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2
              className="size-4 animate-spin"
              strokeWidth={1.5}
            />
            Creating...
          </>
        ) : (
          <>
            Create account
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
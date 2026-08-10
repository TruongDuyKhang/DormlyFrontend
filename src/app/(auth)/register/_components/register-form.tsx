// app/(auth)/register/_components/register-form.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
  Moon,
  Sun,
  Volume2,
  Users,
  BookOpen,
  Clock,
  RefreshCw,
  UserPlus,
  GraduationCap,
  Send,
  CheckCircle,
} from "lucide-react";

import { registerSchema, type RegisterFormValues } from "./register-schema";
import {
  sleepTimeOptions,
  wakeTimeOptions,
  levelOptions,
  majorOptions,
} from "./constants";
import {
  quietPreferenceLabels,
  socialPreferenceLabels,
  studyHabitLabels,
  routineStrictnessLabels,
  adaptabilityLabels,
} from "./constants";
import { getErrorMessage } from "./utils";
import { CustomSelect } from "./custom-select";
import { TimeSelect } from "./time-select";
import { YearSelect } from "./year-select";
import { FileUploadField } from "./file-upload-field";
import { RoommatePreference } from "./roommate-preference";
import { useRegisterOtp } from "../hooks/useRegisterOtp";
import { RegisterRequestBody } from "../types/register";
import { useRegister } from "../hooks/useRegister";
import { toast } from "sonner";

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { execute: registerUser, loading: registerLoading } = useRegister();
  const [otpSent, setOtpSent] = useState(false);

  const getLevelScore = (value: string): number => {
    switch (value) {
      case "1":
        return 10;
      case "2":
        return 30;
      case "3":
        return 50;
      case "4":
        return 70;
      case "5":
        return 90;
      default:
        return 50;
    }
  };

  const {
    execute: sendOtp,
    loading: otpLoading,
    error: otpError,
    cooldown,
    reset: resetOtp,
  } = useRegisterOtp();

  const [citizenIdFile, setCitizenIdFile] = useState<File | null>(null);
  const [studentCardFile, setStudentCardFile] = useState<File | null>(null);
  const [citizenIdError, setCitizenIdError] = useState<string>("");
  const [studentCardError, setStudentCardError] = useState<string>("");

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);
  const handleChangeEmail = () => {
    setOtpSent(false);
    resetOtp();
    setValue("registrationCode", "");
    setValue("email", "");
  };
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema) as any,
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      fullName: "",
      studentCode: "",
      dateOfBirth: "",
      major: "",
      identityNumber: "",
      startYear: "",
      endYear: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      registrationCode: "",
      sleepTime: "",
      wakeUpTime: "",
      quietPreference: "",
      socialPreference: "",
      studyHabit: "",
      routineStrictness: "",
      adaptability: "",
      roommatePreference: "",
      friendName: "",
      friendStudentId: "",
      friendBlock: "",
      friendFloor: "",
      friendRoom: "",
    },
  });

  const watchQuiet = watch("quietPreference");
  const watchSocial = watch("socialPreference");
  const watchStudy = watch("studyHabit");
  const watchRoutine = watch("routineStrictness");
  const watchAdapt = watch("adaptability");
  const watchStartYear = watch("startYear");
  const watchEndYear = watch("endYear");
  const watchSleepTime = watch("sleepTime");
  const watchWakeUpTime = watch("wakeUpTime");
  const watchRoommatePreference = watch("roommatePreference");

  const validateFiles = (): boolean => {
    let isValid = true;

    if (!citizenIdFile) {
      setCitizenIdError("Citizen ID is required");
      isValid = false;
    } else {
      setCitizenIdError("");
    }

    if (!studentCardFile) {
      setStudentCardError("Student Card is required");
      isValid = false;
    } else {
      setStudentCardError("");
    }

    return isValid;
  };

  const handleSendOtp = async () => {
    const email = getValues("email");
    if (!email || !email.includes("@")) {
      setError("email", {
        type: "manual",
        message: "Please enter a valid email first.",
      });
      toast.error("Please enter a valid email first.");
      return;
    }

    try {
      await sendOtp(email);
      setOtpSent(true);
      toast.success("OTP code sent to your email!");
    } catch (err) {
      console.error("OTP send failed:", err);
      toast.error("Failed to send OTP. Please try again.");
    }
  };

  const onInvalid = (errs: typeof errors) => {
    const firstErrorKey = Object.keys(errs)[0] as keyof typeof errs;
    if (firstErrorKey) {
      const el = document.querySelector(
        `[name="${String(firstErrorKey)}"]`,
      ) as HTMLElement;
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.focus();
      }
      // Lấy error message từ field đầu tiên
      const firstError = errs[firstErrorKey];
      if (firstError?.message) {
        toast.error(String(firstError.message));
      }
    }
  };

  const onSubmit = async (values: RegisterFormValues) => {
    if (!otpSent) {
      toast.error("Please verify your email with OTP code first.");
      return;
    }

    if (!validateFiles()) {
      toast.error("Please upload all required documents.");
      return;
    }

    try {
      const sleepOption = sleepTimeOptions.find(
        (opt) => opt.value === values.sleepTime,
      );
      const wakeOption = wakeTimeOptions.find(
        (opt) => opt.value === values.wakeUpTime,
      );

      const requestBody: RegisterRequestBody = {
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        phoneNumber: values.phoneNumber,
        dateOfBirth: new Date(values.dateOfBirth).toISOString(),
        roles: ["User"],
        registrationCode: values.registrationCode,
        studentCode: values.studentCode,
        major: values.major,
        identityNumber: values.identityNumber,
        startYear: parseInt(values.startYear),
        endYear: parseInt(values.endYear),
        sleepTime: values.sleepTime,
        wakeUpTime: values.wakeUpTime,
        sleepScore: sleepOption?.score ?? 50,
        wakeScore: wakeOption?.score ?? 50,
        quietPreference: parseInt(values.quietPreference) || 3,
        quietPreferenceScore: getLevelScore(values.quietPreference),
        socialPreference: parseInt(values.socialPreference) || 3,
        socialPreferenceScore: getLevelScore(values.socialPreference),
        studyHabit: parseInt(values.studyHabit) || 3,
        studyHabitScore: getLevelScore(values.studyHabit),
        routineStrictness: parseInt(values.routineStrictness) || 3,
        routineStrictnessScore: getLevelScore(values.routineStrictness),
        adaptability: parseInt(values.adaptability) || 3,
        adaptabilityScore: getLevelScore(values.adaptability),
        roommatePreference: values.roommatePreference,
        friendName: values.friendName || "",
        friendStudentId: values.friendStudentId || "",
        friendBlock: values.friendBlock || "",
        friendFloor: values.friendFloor || "",
        friendRoom: values.friendRoom || "",
      };

      await registerUser(requestBody, citizenIdFile!, studentCardFile!);

      toast.success(
        "Registration successful! Your application will be reviewed by admin.",
        {
          duration: 5000,
        },
      );

      setTimeout(() => {
        router.replace("/login");
      }, 2000);
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast.error(message);
    }
  };

  const inputClass = (hasError: boolean) =>
    `h-12 w-full rounded-2xl border bg-white pl-11 pr-4 text-sm font-medium text-stone-950 shadow-[0_18px_56px_-34px_rgba(28,25,23,0.92)] outline-none transition placeholder:text-stone-400 ${
      hasError
        ? "border-red-400 focus:border-red-500"
        : "border-stone-950/15 focus:border-stone-950/45"
    }`;

  const isFriendSelected = watchRoommatePreference === "friend";

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-4">
      {/* ========== BASIC INFORMATION ========== */}
      <div className="border-b border-stone-200 pb-3 mb-2">
        <h3 className="text-sm font-bold text-stone-800">Basic Information</h3>
      </div>

      {/* Email với OTP */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-stone-900">Email</label>
          {otpSent && (
            <button
              type="button"
              onClick={handleChangeEmail}
              className="text-xs font-medium text-[#9d7443] underline hover:text-[#7d5a33]"
            >
              Change email
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Mail
              className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400"
              strokeWidth={1.5}
            />
            <input
              {...register("email")}
              type="email"
              placeholder="student@dormly.edu"
              className={inputClass(Boolean(errors.email))}
              disabled={otpSent}
            />
          </div>
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={otpLoading || otpSent || cooldown > 0}
            className="h-12 px-4 rounded-2xl bg-stone-950 text-white text-sm font-medium transition hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
          >
            {otpLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : otpSent ? (
              <CheckCircle className="size-4" />
            ) : cooldown > 0 ? (
              `${cooldown}s`
            ) : (
              <>
                <Send className="size-4" />
                Send code
              </>
            )}
          </button>
        </div>
        {errors.email && (
          <p className="text-xs text-red-700">{errors.email.message}</p>
        )}
        {otpError && <p className="text-xs text-red-700">{otpError}</p>}
        {otpSent && (
          <p className="text-xs text-emerald-600 flex items-center gap-1">
            <CheckCircle className="size-3" />
            OTP code sent to your email. Please check your inbox.
          </p>
        )}
      </div>

      {/* OTP Input */}
      {otpSent && (
        <div className="space-y-1">
          <label className="text-sm font-semibold text-stone-900">
            Verification Code (OTP)
          </label>
          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400"
              strokeWidth={1.5}
            />
            <input
              {...register("registrationCode")}
              type="text"
              placeholder="Enter 6-digit code"
              className={inputClass(Boolean(errors.registrationCode))}
              maxLength={6}
            />
          </div>
          {errors.registrationCode && (
            <p className="text-xs text-red-700">
              {errors.registrationCode.message}
            </p>
          )}
        </div>
      )}

      {/* Form phía dưới - disabled khi chưa gửi OTP */}
      <fieldset
        disabled={!otpSent}
        className={!otpSent ? "opacity-40 pointer-events-none" : ""}
      >
        <div className="grid grid-cols-2 gap-3">
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
              <p className="text-xs text-red-700">{errors.fullName.message}</p>
            )}
          </div>

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
                {...register("studentCode")}
                type="text"
                placeholder="ST20260001"
                className={inputClass(Boolean(errors.studentCode))}
              />
            </div>
            {errors.studentCode && (
              <p className="text-xs text-red-700">
                {errors.studentCode.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-stone-900">
              Major
            </label>
            <CustomSelect
              value={watch("major")}
              onChange={(val) => setValue("major", val)}
              options={majorOptions}
              placeholder="Select your major"
              error={Boolean(errors.major)}
              icon={<GraduationCap className="size-3.5" />}
            />
            {errors.major && (
              <p className="text-xs text-red-700">{errors.major.message}</p>
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
                className={inputClass(Boolean(errors.dateOfBirth))}
              />
            </div>
            {errors.dateOfBirth && (
              <p className="text-xs text-red-700">
                {errors.dateOfBirth.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-stone-900">
              Identity Number (CCCD)
            </label>
            <div className="relative">
              <IdCard
                className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400"
                strokeWidth={1.5}
              />
              <input
                {...register("identityNumber")}
                type="text"
                placeholder="012345678901"
                className={inputClass(Boolean(errors.identityNumber))}
                maxLength={12}
              />
            </div>
            {errors.identityNumber && (
              <p className="text-xs text-red-700">
                {errors.identityNumber.message}
              </p>
            )}
          </div>

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
                {...register("phoneNumber")}
                type="tel"
                placeholder="0901234567"
                className={inputClass(Boolean(errors.phoneNumber))}
                maxLength={11}
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-xs text-red-700">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-stone-900">
              Start year
            </label>
            <YearSelect
              value={watchStartYear}
              onChange={(val) => setValue("startYear", val)}
              years={years}
              error={Boolean(errors.startYear)}
              placeholder="Select year"
            />
            {errors.startYear && (
              <p className="text-xs text-red-700">{errors.startYear.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-stone-900">
              End year
            </label>
            <YearSelect
              value={watchEndYear}
              onChange={(val) => setValue("endYear", val)}
              years={years}
              error={Boolean(errors.endYear)}
              placeholder="Select year"
            />
            {errors.endYear && (
              <p className="text-xs text-red-700">{errors.endYear.message}</p>
            )}
          </div>
        </div>

        {/* ========== LIFESTYLE PREFERENCES ========== */}
        <div className="border-b border-stone-200 pb-3 mt-4 mb-2">
          <h3 className="text-sm font-bold text-stone-800">
            Lifestyle Preferences
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            This helps us find compatible roommates for you
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-stone-900 flex items-center gap-1">
              <Moon className="size-3.5" /> Sleep time
            </label>
            <TimeSelect
              value={watchSleepTime}
              onChange={(val) => setValue("sleepTime", val)}
              options={sleepTimeOptions}
              placeholder="Select sleep time"
              error={Boolean(errors.sleepTime)}
              icon={<Moon className="size-3.5" />}
            />
            {errors.sleepTime && (
              <p className="text-xs text-red-700">{errors.sleepTime.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-stone-900 flex items-center gap-1">
              <Sun className="size-3.5" /> Wake-up time
            </label>
            <TimeSelect
              value={watchWakeUpTime}
              onChange={(val) => setValue("wakeUpTime", val)}
              options={wakeTimeOptions}
              placeholder="Select wake-up time"
              error={Boolean(errors.wakeUpTime)}
              icon={<Sun className="size-3.5" />}
            />
            {errors.wakeUpTime && (
              <p className="text-xs text-red-700">
                {errors.wakeUpTime.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-stone-900 flex items-center gap-1">
            <Volume2 className="size-3.5" /> Quiet environment preference
          </label>
          <CustomSelect
            value={watchQuiet}
            onChange={(val) => setValue("quietPreference", val)}
            options={levelOptions.map((opt) => ({
              value: opt.value,
              label: `${opt.label} - ${quietPreferenceLabels[opt.value]}`,
            }))}
            placeholder="Select your preference"
            error={Boolean(errors.quietPreference)}
            icon={<Volume2 className="size-3.5" />}
          />
          {errors.quietPreference && (
            <p className="text-xs text-red-700">
              {errors.quietPreference.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-stone-900 flex items-center gap-1">
            <Users className="size-3.5" /> Social interaction preference
          </label>
          <CustomSelect
            value={watchSocial}
            onChange={(val) => setValue("socialPreference", val)}
            options={levelOptions.map((opt) => ({
              value: opt.value,
              label: `${opt.label} - ${socialPreferenceLabels[opt.value]}`,
            }))}
            placeholder="Select your preference"
            error={Boolean(errors.socialPreference)}
            icon={<Users className="size-3.5" />}
          />
          {errors.socialPreference && (
            <p className="text-xs text-red-700">
              {errors.socialPreference.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-stone-900 flex items-center gap-1">
            <BookOpen className="size-3.5" /> Study habit
          </label>
          <CustomSelect
            value={watchStudy}
            onChange={(val) => setValue("studyHabit", val)}
            options={levelOptions.map((opt) => ({
              value: opt.value,
              label: `${opt.label} - ${studyHabitLabels[opt.value]}`,
            }))}
            placeholder="Select your preference"
            error={Boolean(errors.studyHabit)}
            icon={<BookOpen className="size-3.5" />}
          />
          {errors.studyHabit && (
            <p className="text-xs text-red-700">{errors.studyHabit.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-stone-900 flex items-center gap-1">
            <Clock className="size-3.5" /> Routine strictness
          </label>
          <CustomSelect
            value={watchRoutine}
            onChange={(val) => setValue("routineStrictness", val)}
            options={levelOptions.map((opt) => ({
              value: opt.value,
              label: `${opt.label} - ${routineStrictnessLabels[opt.value]}`,
            }))}
            placeholder="Select your preference"
            error={Boolean(errors.routineStrictness)}
            icon={<Clock className="size-3.5" />}
          />
          {errors.routineStrictness && (
            <p className="text-xs text-red-700">
              {errors.routineStrictness.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-stone-900 flex items-center gap-1">
            <RefreshCw className="size-3.5" /> Adaptability
          </label>
          <CustomSelect
            value={watchAdapt}
            onChange={(val) => setValue("adaptability", val)}
            options={levelOptions.map((opt) => ({
              value: opt.value,
              label: `${opt.label} - ${adaptabilityLabels[opt.value]}`,
            }))}
            placeholder="Select your preference"
            error={Boolean(errors.adaptability)}
            icon={<RefreshCw className="size-3.5" />}
          />
          {errors.adaptability && (
            <p className="text-xs text-red-700">
              {errors.adaptability.message}
            </p>
          )}
        </div>

        {/* ========== ROOMMATE PREFERENCE ========== */}
        <div className="border-b border-stone-200 pb-3 mt-4 mb-2">
          <h3 className="text-sm font-bold text-stone-800">
            Roommate Preference
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Choose how you want to be assigned a roommate
          </p>
        </div>

        <RoommatePreference
          value={watchRoommatePreference}
          onChange={(val) => setValue("roommatePreference", val)}
          error={errors}
        />

        {isFriendSelected && (
          <div className="space-y-3 rounded-2xl border border-[#9d7443]/30 bg-amber-50/50 p-4">
            <p className="text-sm font-semibold text-stone-800 flex items-center gap-2">
              <UserPlus className="size-4 text-[#9d7443]" />
              Friend Information
            </p>
            <p className="text-xs text-stone-500">
              Please provide your friend's current residence details
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold text-stone-900">
                  Friend's full name
                </label>
                <input
                  {...register("friendName")}
                  type="text"
                  placeholder="Enter friend's full name"
                  className={`h-12 w-full rounded-2xl border bg-white px-4 text-sm font-medium text-stone-950 shadow-[0_18px_56px_-34px_rgba(28,25,23,0.92)] outline-none transition placeholder:text-stone-400 ${
                    errors.friendName
                      ? "border-red-400 focus:border-red-500"
                      : "border-stone-950/15 focus:border-stone-950/45"
                  }`}
                />
                {errors.friendName && (
                  <p className="text-xs text-red-700">
                    {errors.friendName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-stone-900">
                  Friend's Student ID
                </label>
                <input
                  {...register("friendStudentId")}
                  type="text"
                  placeholder="Enter friend's student ID"
                  className={`h-12 w-full rounded-2xl border bg-white px-4 text-sm font-medium text-stone-950 shadow-[0_18px_56px_-34px_rgba(28,25,23,0.92)] outline-none transition placeholder:text-stone-400 ${
                    errors.friendStudentId
                      ? "border-red-400 focus:border-red-500"
                      : "border-stone-950/15 focus:border-stone-950/45"
                  }`}
                />
                {errors.friendStudentId && (
                  <p className="text-xs text-red-700">
                    {errors.friendStudentId.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-sm font-semibold text-stone-900">
                    Block
                  </label>
                  <input
                    {...register("friendBlock")}
                    type="text"
                    placeholder="e.g., A"
                    className={`h-12 w-full rounded-2xl border bg-white px-4 text-sm font-medium text-stone-950 shadow-[0_18px_56px_-34px_rgba(28,25,23,0.92)] outline-none transition placeholder:text-stone-400 ${
                      errors.friendBlock
                        ? "border-red-400 focus:border-red-500"
                        : "border-stone-950/15 focus:border-stone-950/45"
                    }`}
                  />
                  {errors.friendBlock && (
                    <p className="text-xs text-red-700">
                      {errors.friendBlock.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-semibold text-stone-900">
                    Floor
                  </label>
                  <input
                    {...register("friendFloor")}
                    type="text"
                    placeholder="e.g., 3"
                    className={`h-12 w-full rounded-2xl border bg-white px-4 text-sm font-medium text-stone-950 shadow-[0_18px_56px_-34px_rgba(28,25,23,0.92)] outline-none transition placeholder:text-stone-400 ${
                      errors.friendFloor
                        ? "border-red-400 focus:border-red-500"
                        : "border-stone-950/15 focus:border-stone-950/45"
                    }`}
                  />
                  {errors.friendFloor && (
                    <p className="text-xs text-red-700">
                      {errors.friendFloor.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-semibold text-stone-900">
                    Room
                  </label>
                  <input
                    {...register("friendRoom")}
                    type="text"
                    placeholder="e.g., 304"
                    className={`h-12 w-full rounded-2xl border bg-white px-4 text-sm font-medium text-stone-950 shadow-[0_18px_56px_-34px_rgba(28,25,23,0.92)] outline-none transition placeholder:text-stone-400 ${
                      errors.friendRoom
                        ? "border-red-400 focus:border-red-500"
                        : "border-stone-950/15 focus:border-stone-950/45"
                    }`}
                  />
                  {errors.friendRoom && (
                    <p className="text-xs text-red-700">
                      {errors.friendRoom.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========== DOCUMENTS UPLOAD ========== */}
        <div className="border-b border-stone-200 pb-3 mt-4 mb-2">
          <h3 className="text-sm font-bold text-stone-800">
            Required Documents
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Please upload clear images of your documents
          </p>
        </div>

        <FileUploadField
          label="Citizen ID"
          required
          accept="image/jpeg,image/png,image/jpg,application/pdf"
          onFileSelect={setCitizenIdFile}
          error={citizenIdError}
        />

        <FileUploadField
          label="Student Card"
          required
          accept="image/jpeg,image/png,image/jpg,application/pdf"
          onFileSelect={setStudentCardFile}
          error={studentCardError}
        />

        {/* ========== PASSWORD ========== */}
        <div className="border-b border-stone-200 pb-3 mt-4 mb-2">
          <h3 className="text-sm font-bold text-stone-800">Security</h3>
        </div>

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
                className={`${inputClass(Boolean(errors.password))} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-950/5"
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

          <div className="space-y-1">
            <label className="text-sm font-semibold text-stone-900">
              Confirm password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400"
                strokeWidth={1.5}
              />
              <input
                {...register("confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm"
                className={`${inputClass(Boolean(errors.confirmPassword))} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-950/5"
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-4" strokeWidth={1.5} />
                ) : (
                  <Eye className="size-4" strokeWidth={1.5} />
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
      </fieldset>

      <button
        type="submit"
        disabled={registerLoading || !otpSent}
        className="group mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-stone-950 px-5 text-sm font-semibold text-white shadow-[0_28px_80px_-34px_rgba(0,0,0,0.92)] transition hover:bg-stone-800 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
      >
        {registerLoading ? (
          <>
            <Loader2 className="size-4 animate-spin" strokeWidth={1.5} />
            Submitting...
          </>
        ) : !otpSent ? (
          "Verify email with OTP first"
        ) : (
          <>
            Submit Registration
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

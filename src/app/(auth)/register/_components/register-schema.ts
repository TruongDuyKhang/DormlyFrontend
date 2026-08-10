// app/(auth)/register/_components/register-schema.ts
import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.string().email("Please enter a valid email address."),
    fullName: z.string().min(2, "Full name must be at least 2 characters."),
    studentCode: z.string().min(5, "Student ID must be at least 5 characters."),
    dateOfBirth: z.string().min(1, "Please select your date of birth."),
    major: z.string().min(1, "Please select your major."),
    identityNumber: z
      .string()
      .min(12, "Identity number must be exactly 12 digits.")
      .max(12, "Identity number must be exactly 12 digits.")
      .regex(/^\d{12}$/, "Identity number must contain only digits."),
    startYear: z.string().min(4, "Please select start year."),
    endYear: z.string().min(4, "Please select end year."),
    phoneNumber: z
      .string()
      .min(10, "Phone number must be 10-11 digits.")
      .max(11, "Phone number must be 10-11 digits.")
      .regex(/^\d{10,11}$/, "Phone number must contain only digits."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string().min(6, "Please confirm your password."),
    registrationCode: z.string().min(6, "Please enter the 6-digit OTP code."),
    roommatePreference: z.string().min(1, "Please select your roommate preference."),
    // Lifestyle fields - optional by default, required only when roommatePreference === "system"
    sleepTime: z.string().default(""),
    wakeUpTime: z.string().default(""),
    quietPreference: z.string().default(""),
    socialPreference: z.string().default(""),
    studyHabit: z.string().default(""),
    routineStrictness: z.string().default(""),
    adaptability: z.string().default(""),
    // Friend fields - required only when roommatePreference === "friend"
    friendName: z.string().default(""),
    friendStudentId: z.string().default(""),
    friendBlock: z.string().default(""),
    friendFloor: z.string().default(""),
    friendRoom: z.string().default(""),
  })
  // Password match validation
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  })
  // End year must be at least 2 years after start year
  .refine(
    (data) => {
      if (!data.startYear || !data.endYear) return true;
      const start = parseInt(data.startYear);
      const end = parseInt(data.endYear);
      return end >= start + 2;
    },
    {
      message: "End year must be at least 2 years after start year.",
      path: ["endYear"],
    }
  )
  // Friend fields validation (only when roommatePreference === "friend")
  .refine(
    (data) => {
      if (data.roommatePreference === "friend") {
        return data.friendName && data.friendName.trim().length > 0;
      }
      return true;
    },
    { message: "Please enter your friend's full name.", path: ["friendName"] }
  )
  .refine(
    (data) => {
      if (data.roommatePreference === "friend") {
        return data.friendStudentId && data.friendStudentId.trim().length > 0;
      }
      return true;
    },
    { message: "Please enter your friend's student ID.", path: ["friendStudentId"] }
  )
  .refine(
    (data) => {
      if (data.roommatePreference === "friend") {
        return data.friendBlock && data.friendBlock.trim().length > 0;
      }
      return true;
    },
    { message: "Please enter your friend's block.", path: ["friendBlock"] }
  )
  .refine(
    (data) => {
      if (data.roommatePreference === "friend") {
        return data.friendFloor && data.friendFloor.trim().length > 0;
      }
      return true;
    },
    { message: "Please enter your friend's floor.", path: ["friendFloor"] }
  )
  .refine(
    (data) => {
      if (data.roommatePreference === "friend") {
        return data.friendRoom && data.friendRoom.trim().length > 0;
      }
      return true;
    },
    { message: "Please enter your friend's room number.", path: ["friendRoom"] }
  )
  // Lifestyle fields validation (only when roommatePreference === "system")
  .refine(
    (data) => data.roommatePreference !== "system" || data.sleepTime.trim().length > 0,
    { message: "Please select your preferred sleep time.", path: ["sleepTime"] }
  )
  .refine(
    (data) => data.roommatePreference !== "system" || data.wakeUpTime.trim().length > 0,
    { message: "Please select your preferred wake-up time.", path: ["wakeUpTime"] }
  )
  .refine(
    (data) => data.roommatePreference !== "system" || data.quietPreference.trim().length > 0,
    { message: "Please select your quiet environment preference.", path: ["quietPreference"] }
  )
  .refine(
    (data) => data.roommatePreference !== "system" || data.socialPreference.trim().length > 0,
    { message: "Please select your social interaction preference.", path: ["socialPreference"] }
  )
  .refine(
    (data) => data.roommatePreference !== "system" || data.studyHabit.trim().length > 0,
    { message: "Please select your study habit preference.", path: ["studyHabit"] }
  )
  .refine(
    (data) => data.roommatePreference !== "system" || data.routineStrictness.trim().length > 0,
    { message: "Please select your routine strictness.", path: ["routineStrictness"] }
  )
  .refine(
    (data) => data.roommatePreference !== "system" || data.adaptability.trim().length > 0,
    { message: "Please select your adaptability level.", path: ["adaptability"] }
  );

// Export type từ schema
export type RegisterFormValues = z.infer<typeof registerSchema>;
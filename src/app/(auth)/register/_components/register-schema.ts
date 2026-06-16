// app/(auth)/register/_components/register-schema.ts
import { z } from "zod";

export const registerSchema = z
  .object({
    // Basic info
    email: z.string().email("Please enter a valid email address."),
    fullName: z.string().min(2, "Full name must be at least 2 characters."),
    studentId: z.string().min(5, "Student ID must be at least 5 characters."),
    dateOfBirth: z.string().min(1, "Please select your date of birth."),
    startYear: z.string().min(4, "Please select start year."),
    endYear: z.string().min(4, "Please select end year."),
    phone: z.string().min(10, "Phone number must be at least 10 digits."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string().min(6, "Please confirm your password."),
    sleepTime: z.string().min(1, "Please select your preferred sleep time."),
    wakeUpTime: z.string().min(1, "Please select your preferred wake-up time."),
    quietPreference: z.string().min(1, "Please select your quiet environment preference."),
    socialPreference: z.string().min(1, "Please select your social interaction preference."),
    studyHabit: z.string().min(1, "Please select your study habit preference."),
    routineStrictness: z.string().min(1, "Please select your routine strictness."),
    adaptability: z.string().min(1, "Please select your adaptability level."),
    roommatePreference: z.string().min(1, "Please select your roommate preference."),
    friendName: z.string().optional(),
    friendStudentId: z.string().optional(), // NEW: Student ID của bạn
    friendBlock: z.string().optional(),
    friendFloor: z.string().optional(),
    friendRoom: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  })
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
  );

export type RegisterFormValues = z.infer<typeof registerSchema>;
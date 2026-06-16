// app/(auth)/register/_components/register-types.ts

export interface FileWithPreview {
  file: File;
  preview: string;
  name: string;
  size: string;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
}

export interface RegisterFormValues {
  email: string;
  fullName: string;
  studentId: string;
  dateOfBirth: string;
  startYear: string;
  endYear: string;
  phone: string;
  password: string;
  confirmPassword: string;
  sleepTime: string;
  wakeUpTime: string;
  quietPreference: string;
  socialPreference: string;
  studyHabit: string;
  routineStrictness: string;
  adaptability: string;
  roommatePreference: string;
  friendName?: string;
  friendStudentId?: string; // NEW
  friendBlock?: string;
  friendFloor?: string;
  friendRoom?: string;
}
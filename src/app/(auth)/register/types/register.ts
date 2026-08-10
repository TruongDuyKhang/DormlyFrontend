// app/(auth)/register/types/register.ts

// Form values - dùng cho react-hook-form
export interface RegisterFormValues {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  studentCode: string;
  phoneNumber: string;
  dateOfBirth: string;
  major: string;
  identityNumber: string;
  startYear: string;
  endYear: string;
  sleepTime: string;
  wakeUpTime: string;
  quietPreference: string;
  socialPreference: string;
  studyHabit: string;
  routineStrictness: string;
  adaptability: string;
  roommatePreference: string;
  registrationCode: string;
  friendName: string;
  friendStudentId: string;
  friendBlock: string;
  friendFloor: string;
  friendRoom: string;
}

// Payload gửi lên backend
export interface RegisterRequestBody {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  dateOfBirth: string;
  roles: string[];
  registrationCode: string;
  studentCode: string;
  major: string;
  identityNumber: string;
  startYear: number;
  endYear: number;
  sleepTime: string;
  wakeUpTime: string;
  sleepScore: number;
  wakeScore: number;
  quietPreference: number;
  quietPreferenceScore: number;
  socialPreference: number;
  socialPreferenceScore: number;
  studyHabit: number;
  studyHabitScore: number;
  routineStrictness: number;
  routineStrictnessScore: number;
  adaptability: number;
  adaptabilityScore: number;
  roommatePreference: string;
  friendName: string;
  friendStudentId: string;
  friendBlock: string;
  friendFloor: string;
  friendRoom: string;
}

export interface RegisterResult {
  userId: string;
  email: string;
  status: string;
}

// File với preview
export interface FileWithPreview {
  file: File;
  preview: string;
  name: string;
  size: string;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
}
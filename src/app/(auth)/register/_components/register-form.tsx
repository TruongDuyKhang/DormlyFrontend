// app/(auth)/register/_components/register-form.tsx
"use client";

import { useState, useRef } from "react";
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
  Moon,
  Sun,
  Volume2,
  Users,
  BookOpen,
  Clock,
  RefreshCw,
  ChevronDown,
  Upload,
  FileText,
  CheckCircle,
  XCircle,
} from "lucide-react";

// File validation
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];

// Zod schema với lifestyle preferences và file upload
const registerSchema = z
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
    
    // Lifestyle preferences
    sleepTime: z.string().min(1, "Please select your preferred sleep time."),
    wakeUpTime: z.string().min(1, "Please select your preferred wake-up time."),
    quietPreference: z.string().min(1, "Please select your quiet environment preference."),
    socialPreference: z.string().min(1, "Please select your social interaction preference."),
    studyHabit: z.string().min(1, "Please select your study habit preference."),
    routineStrictness: z.string().min(1, "Please select your routine strictness."),
    adaptability: z.string().min(1, "Please select your adaptability level."),
    
    // Files (will be validated separately)
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

// Sleep time options
const sleepTimeOptions = [
  { value: "21:00", label: "Before 10:00 PM", band: "before_22", score: 10, description: "Very early sleeper" },
  { value: "22:00", label: "10:00 PM - 11:00 PM", band: "22_23", score: 25, description: "Early sleeper" },
  { value: "23:00", label: "11:00 PM - 12:00 AM", band: "23_00", score: 50, description: "Normal sleeper" },
  { value: "00:00", label: "12:00 AM - 1:00 AM", band: "00_01", score: 75, description: "Late sleeper" },
  { value: "01:00", label: "After 1:00 AM", band: "after_01", score: 90, description: "Very late sleeper" },
];

// Wake time options
const wakeTimeOptions = [
  { value: "05:00", label: "Before 6:00 AM", band: "before_06", score: 10, description: "Very early riser" },
  { value: "06:00", label: "6:00 AM - 7:00 AM", band: "06_07", score: 25, description: "Early riser" },
  { value: "07:00", label: "7:00 AM - 8:00 AM", band: "07_08", score: 50, description: "Normal riser" },
  { value: "08:00", label: "8:00 AM - 9:00 AM", band: "08_09", score: 75, description: "Late riser" },
  { value: "09:00", label: "After 9:00 AM", band: "after_09", score: 90, description: "Very late riser" },
];

// Level options
const levelOptions = [
  { value: "1", label: "Level 1" },
  { value: "2", label: "Level 2" },
  { value: "3", label: "Level 3" },
  { value: "4", label: "Level 4" },
  { value: "5", label: "Level 5" },
];

// Labels for each preference
const quietPreferenceLabels = {
  "1": "I need a very quiet room",
  "2": "I prefer a quiet room",
  "3": "Neutral",
  "4": "I can tolerate normal room noise",
  "5": "I am comfortable with an active/noisy room",
};

const socialPreferenceLabels = {
  "1": "I prefer privacy most of the time",
  "2": "I prefer limited interaction",
  "3": "Neutral",
  "4": "I like talking with roommates",
  "5": "I enjoy a highly social room",
};

const studyHabitLabels = {
  "1": "I mostly study alone in silence",
  "2": "I prefer quiet individual study",
  "3": "Flexible / neutral",
  "4": "I sometimes study with others",
  "5": "I often study in groups / active settings",
};

const routineStrictnessLabels = {
  "1": "My routine changes often",
  "2": "My routine is somewhat flexible",
  "3": "Neutral",
  "4": "I usually follow a fixed routine",
  "5": "I strongly follow the same routine every day",
};

const adaptabilityLabels = {
  "1": "I find it difficult to adapt to new living habits",
  "2": "I need time to adapt",
  "3": "Neutral",
  "4": "I can adapt to most roommates",
  "5": "I adapt very easily",
};

interface FileWithPreview {
  file: File;
  preview: string;
  name: string;
  size: string;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Registration failed. Please try again.";
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

// Custom Time Select Component
function TimeSelect({ value, onChange, options, placeholder, error, icon }: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; description: string }[];
  placeholder: string;
  error?: boolean;
  icon?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`h-12 w-full rounded-2xl border bg-white px-4 text-sm font-medium text-stone-950 shadow-[0_18px_56px_-34px_rgba(28,25,23,0.92)] outline-none transition-all flex items-center justify-between ${
          error
            ? "border-red-400 focus:border-red-500"
            : "border-stone-950/15 focus:border-stone-950/45"
        } ${!selectedOption ? "text-stone-400" : "text-stone-950"}`}
      >
        <span className="flex items-center gap-2">
          {icon && <span className="text-stone-400">{icon}</span>}
          {selectedOption ? `${selectedOption.label} (${selectedOption.description})` : placeholder}
        </span>
        <ChevronDown className={`size-4 text-stone-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 right-0 top-full mt-2 z-50 max-h-64 overflow-auto rounded-2xl border border-stone-200 bg-white shadow-lg">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left transition hover:bg-stone-50 ${
                  value === option.value ? "bg-amber-50 text-[#9d7443]" : "text-stone-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{option.label}</span>
                  <span className="text-xs text-stone-400">{option.description}</span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Custom Select Component
function CustomSelect({ value, onChange, options, placeholder, error, icon }: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  error?: boolean;
  icon?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`h-12 w-full rounded-2xl border bg-white px-4 text-sm font-medium text-stone-950 shadow-[0_18px_56px_-34px_rgba(28,25,23,0.92)] outline-none transition-all flex items-center justify-between ${
          error
            ? "border-red-400 focus:border-red-500"
            : "border-stone-950/15 focus:border-stone-950/45"
        } ${!selectedOption ? "text-stone-400" : "text-stone-950"}`}
      >
        <span className="flex items-center gap-2">
          {icon && <span className="text-stone-400">{icon}</span>}
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`size-4 text-stone-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 right-0 top-full mt-2 z-50 max-h-64 overflow-auto rounded-2xl border border-stone-200 bg-white shadow-lg">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left text-sm transition hover:bg-stone-50 ${
                  value === option.value ? "bg-amber-50 text-[#9d7443] font-medium" : "text-stone-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Year Select Component
function YearSelect({ value, onChange, years, error, placeholder }: {
  value: string;
  onChange: (value: string) => void;
  years: number[];
  error?: boolean;
  placeholder: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const options = [{ value: "", label: placeholder }, ...years.map(year => ({ value: year.toString(), label: year.toString() }))];
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`h-12 w-full rounded-2xl border bg-white px-4 text-sm font-medium text-stone-950 shadow-[0_18px_56px_-34px_rgba(28,25,23,0.92)] outline-none transition-all flex items-center justify-between ${
          error
            ? "border-red-400 focus:border-red-500"
            : "border-stone-950/15 focus:border-stone-950/45"
        } ${!selectedOption || selectedOption.value === "" ? "text-stone-400" : "text-stone-950"}`}
      >
        {selectedOption && selectedOption.value !== "" ? selectedOption.label : placeholder}
        <ChevronDown className={`size-4 text-stone-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 right-0 top-full mt-2 z-50 max-h-64 overflow-auto rounded-2xl border border-stone-200 bg-white shadow-lg">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left text-sm transition hover:bg-stone-50 ${
                  value === option.value ? "bg-amber-50 text-[#9d7443] font-medium" : "text-stone-700"
                } ${option.value === "" ? "text-stone-400" : ""}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// File Upload Component
function FileUploadField({ label, required, accept, onFileSelect, error }: {
  label: string;
  required?: boolean;
  accept?: string;
  onFileSelect: (file: File | null) => void;
  error?: string;
}) {
  const [file, setFile] = useState<FileWithPreview | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (selectedFile: File | null) => {
    if (!selectedFile) {
      setFile(null);
      onFileSelect(null);
      return;
    }

    // Validate file type
    if (!ACCEPTED_FILE_TYPES.includes(selectedFile.type)) {
      setFile({
        file: selectedFile,
        preview: "",
        name: selectedFile.name,
        size: formatFileSize(selectedFile.size),
        status: "error",
        error: "Only JPG, PNG, or PDF files are allowed",
      });
      onFileSelect(null);
      return;
    }

    // Validate file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      setFile({
        file: selectedFile,
        preview: "",
        name: selectedFile.name,
        size: formatFileSize(selectedFile.size),
        status: "error",
        error: "File size must be less than 5MB",
      });
      onFileSelect(null);
      return;
    }

    // Create preview for images
    const preview = selectedFile.type.startsWith("image/") ? URL.createObjectURL(selectedFile) : "";

    setFile({
      file: selectedFile,
      preview,
      name: selectedFile.name,
      size: formatFileSize(selectedFile.size),
      status: "success",
    });
    onFileSelect(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileChange(droppedFile);
    }
  };

  const removeFile = () => {
    if (file?.preview) {
      URL.revokeObjectURL(file.preview);
    }
    setFile(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-1">
      <label className="text-sm font-semibold text-stone-900">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition ${
            isDragging
              ? "border-[#9d7443] bg-amber-50"
              : error
              ? "border-red-400 bg-red-50/30"
              : "border-stone-300 hover:border-[#9d7443] hover:bg-amber-50/30"
          }`}
        >
          <Upload className="mx-auto h-8 w-8 text-stone-400" />
          <p className="mt-2 text-sm text-stone-600">
            Click or drag & drop to upload
          </p>
          <p className="mt-1 text-xs text-stone-400">
            JPG, PNG, or PDF (max 5MB)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept || "image/jpeg,image/png,image/jpg,application/pdf"}
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            className="hidden"
          />
        </div>
      ) : (
        <div className={`rounded-2xl border p-4 ${
          file.status === "error" ? "border-red-400 bg-red-50/30" : "border-emerald-200 bg-emerald-50/30"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {file.preview ? (
                <img src={file.preview} alt="Preview" className="h-12 w-12 rounded-lg object-cover" />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-stone-100">
                  <FileText className="h-6 w-6 text-stone-500" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-stone-900">{file.name}</p>
                <p className="text-xs text-stone-500">{file.size}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {file.status === "success" && (
                <CheckCircle className="h-5 w-5 text-emerald-500" />
              )}
              {file.status === "error" && (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <button
                type="button"
                onClick={removeFile}
                className="rounded-full p-1 text-stone-400 transition hover:bg-stone-100 hover:text-red-500"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </div>
          </div>
          {file.error && (
            <p className="mt-2 text-xs text-red-500">{file.error}</p>
          )}
        </div>
      )}
      {error && !file && <p className="text-xs text-red-700">{error}</p>}
    </div>
  );
}

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // File states
  const [citizenIdFile, setCitizenIdFile] = useState<File | null>(null);
  const [studentCardFile, setStudentCardFile] = useState<File | null>(null);
  const [citizenIdError, setCitizenIdError] = useState<string>("");
  const [studentCardError, setStudentCardError] = useState<string>("");

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      quietPreference: "",
      socialPreference: "",
      studyHabit: "",
      routineStrictness: "",
      adaptability: "",
      startYear: "",
      endYear: "",
      sleepTime: "",
      wakeUpTime: "",
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

  const mockRegister = async (values: RegisterFormValues, citizenId: File, studentCard: File) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (!values.email.endsWith("@gmail.com") && !values.email.endsWith("@dormly.edu")) {
      throw new Error("Use an approved campus email to continue.");
    }
    
    // Simulate file upload
    console.log("Uploading files:", citizenId.name, studentCard.name);
  };

  const onSubmit = async (values: RegisterFormValues) => {
    setBannerError(null);
    
    if (!validateFiles()) {
      return;
    }
    
    setIsSubmitting(true);

    try {
      await mockRegister(values, citizenIdFile!, studentCardFile!);
      
      const sleepOption = sleepTimeOptions.find(opt => opt.value === values.sleepTime);
      const wakeOption = wakeTimeOptions.find(opt => opt.value === values.wakeUpTime);
      
      console.log("Registration data:", {
        ...values,
        sleepScore: sleepOption?.score,
        wakeScore: wakeOption?.score,
        quietPreferenceScore: parseInt(values.quietPreference) === 1 ? 10 :
                              parseInt(values.quietPreference) === 2 ? 30 :
                              parseInt(values.quietPreference) === 3 ? 50 :
                              parseInt(values.quietPreference) === 4 ? 70 : 90,
        socialPreferenceScore: parseInt(values.socialPreference) === 1 ? 10 : 
                               parseInt(values.socialPreference) === 2 ? 30 :
                               parseInt(values.socialPreference) === 3 ? 50 :
                               parseInt(values.socialPreference) === 4 ? 70 : 90,
        studyHabitScore: parseInt(values.studyHabit) === 1 ? 10 :
                         parseInt(values.studyHabit) === 2 ? 30 :
                         parseInt(values.studyHabit) === 3 ? 50 :
                         parseInt(values.studyHabit) === 4 ? 70 : 90,
        routineStrictnessScore: parseInt(values.routineStrictness) === 1 ? 10 :
                                parseInt(values.routineStrictness) === 2 ? 30 :
                                parseInt(values.routineStrictness) === 3 ? 50 :
                                parseInt(values.routineStrictness) === 4 ? 70 : 90,
        adaptabilityScore: parseInt(values.adaptability) === 1 ? 10 :
                           parseInt(values.adaptability) === 2 ? 30 :
                           parseInt(values.adaptability) === 3 ? 50 :
                           parseInt(values.adaptability) === 4 ? 70 : 90,
      });

      alert("Registration successful! Your application will be reviewed by admin.");
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      setError("email", { type: "server", message });
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {bannerError && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-900/15 bg-red-50/80 p-3">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-700" strokeWidth={1.5} />
          <p className="text-xs leading-relaxed text-red-800">{bannerError}</p>
        </div>
      )}

      {/* ========== BASIC INFORMATION ========== */}
      <div className="border-b border-stone-200 pb-3 mb-2">
        <h3 className="text-sm font-bold text-stone-800">Basic Information</h3>
      </div>

      {/* Email + Fullname */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-stone-900">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400" strokeWidth={1.5} />
            <input {...register("email")} type="email" placeholder="student@dormly.edu" className={inputClass(Boolean(errors.email))} />
          </div>
          {errors.email && <p className="text-xs text-red-700">{errors.email.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-stone-900">Full name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400" strokeWidth={1.5} />
            <input {...register("fullName")} type="text" placeholder="Nguyen Van A" className={inputClass(Boolean(errors.fullName))} />
          </div>
          {errors.fullName && <p className="text-xs text-red-700">{errors.fullName.message}</p>}
        </div>
      </div>

      {/* Student ID + DOB */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-stone-900">Student ID</label>
          <div className="relative">
            <IdCard className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400" strokeWidth={1.5} />
            <input {...register("studentId")} type="text" placeholder="20210001" className={inputClass(Boolean(errors.studentId))} />
          </div>
          {errors.studentId && <p className="text-xs text-red-700">{errors.studentId.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-stone-900">Date of birth</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400" strokeWidth={1.5} />
            <input {...register("dateOfBirth")} type="date" className={inputClass(Boolean(errors.dateOfBirth))} />
          </div>
          {errors.dateOfBirth && <p className="text-xs text-red-700">{errors.dateOfBirth.message}</p>}
        </div>
      </div>

      {/* Start Year + End Year */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-stone-900">Start year</label>
          <YearSelect
            value={watchStartYear}
            onChange={(val) => setValue("startYear", val)}
            years={years}
            error={Boolean(errors.startYear)}
            placeholder="Select year"
          />
          {errors.startYear && <p className="text-xs text-red-700">{errors.startYear.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-stone-900">End year</label>
          <YearSelect
            value={watchEndYear}
            onChange={(val) => setValue("endYear", val)}
            years={years}
            error={Boolean(errors.endYear)}
            placeholder="Select year"
          />
          {errors.endYear && <p className="text-xs text-red-700">{errors.endYear.message}</p>}
        </div>
      </div>

      {/* Phone */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-stone-900">Phone number</label>
        <div className="relative">
          <Phone className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400" strokeWidth={1.5} />
          <input {...register("phone")} type="tel" placeholder="0901 234 567" className={inputClass(Boolean(errors.phone))} />
        </div>
        {errors.phone && <p className="text-xs text-red-700">{errors.phone.message}</p>}
      </div>

      {/* ========== DOCUMENTS UPLOAD ========== */}
      <div className="border-b border-stone-200 pb-3 mt-4 mb-2">
        <h3 className="text-sm font-bold text-stone-800">Required Documents</h3>
        <p className="text-xs text-stone-500 mt-0.5">Please upload clear images of your documents</p>
      </div>

      {/* Citizen ID Upload */}
      <FileUploadField
        label="Citizen ID"
        required
        accept="image/jpeg,image/png,image/jpg,application/pdf"
        onFileSelect={setCitizenIdFile}
        error={citizenIdError}
      />

      {/* Student Card Upload */}
      <FileUploadField
        label="Student Card"
        required
        accept="image/jpeg,image/png,image/jpg,application/pdf"
        onFileSelect={setStudentCardFile}
        error={studentCardError}
      />

      {/* ========== LIFESTYLE PREFERENCES ========== */}
      <div className="border-b border-stone-200 pb-3 mt-4 mb-2">
        <h3 className="text-sm font-bold text-stone-800">Lifestyle Preferences</h3>
        <p className="text-xs text-stone-500 mt-0.5">This helps us find compatible roommates for you</p>
      </div>

      {/* Sleep Time + Wake Up Time */}
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
          {errors.sleepTime && <p className="text-xs text-red-700">{errors.sleepTime.message}</p>}
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
          {errors.wakeUpTime && <p className="text-xs text-red-700">{errors.wakeUpTime.message}</p>}
        </div>
      </div>

      {/* Quiet Preference */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-stone-900 flex items-center gap-1">
          <Volume2 className="size-3.5" /> Quiet environment preference
        </label>
        <CustomSelect
          value={watchQuiet}
          onChange={(val) => setValue("quietPreference", val)}
          options={levelOptions.map(opt => ({
            value: opt.value,
            label: `${opt.label} - ${quietPreferenceLabels[opt.value as keyof typeof quietPreferenceLabels]}`
          }))}
          placeholder="Select your preference"
          error={Boolean(errors.quietPreference)}
          icon={<Volume2 className="size-3.5" />}
        />
        {errors.quietPreference && <p className="text-xs text-red-700">{errors.quietPreference.message}</p>}
      </div>

      {/* Social Preference */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-stone-900 flex items-center gap-1">
          <Users className="size-3.5" /> Social interaction preference
        </label>
        <CustomSelect
          value={watchSocial}
          onChange={(val) => setValue("socialPreference", val)}
          options={levelOptions.map(opt => ({
            value: opt.value,
            label: `${opt.label} - ${socialPreferenceLabels[opt.value as keyof typeof socialPreferenceLabels]}`
          }))}
          placeholder="Select your preference"
          error={Boolean(errors.socialPreference)}
          icon={<Users className="size-3.5" />}
        />
        {errors.socialPreference && <p className="text-xs text-red-700">{errors.socialPreference.message}</p>}
      </div>

      {/* Study Habit */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-stone-900 flex items-center gap-1">
          <BookOpen className="size-3.5" /> Study habit
        </label>
        <CustomSelect
          value={watchStudy}
          onChange={(val) => setValue("studyHabit", val)}
          options={levelOptions.map(opt => ({
            value: opt.value,
            label: `${opt.label} - ${studyHabitLabels[opt.value as keyof typeof studyHabitLabels]}`
          }))}
          placeholder="Select your preference"
          error={Boolean(errors.studyHabit)}
          icon={<BookOpen className="size-3.5" />}
        />
        {errors.studyHabit && <p className="text-xs text-red-700">{errors.studyHabit.message}</p>}
      </div>

      {/* Routine Strictness */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-stone-900 flex items-center gap-1">
          <Clock className="size-3.5" /> Routine strictness
        </label>
        <CustomSelect
          value={watchRoutine}
          onChange={(val) => setValue("routineStrictness", val)}
          options={levelOptions.map(opt => ({
            value: opt.value,
            label: `${opt.label} - ${routineStrictnessLabels[opt.value as keyof typeof routineStrictnessLabels]}`
          }))}
          placeholder="Select your preference"
          error={Boolean(errors.routineStrictness)}
          icon={<Clock className="size-3.5" />}
        />
        {errors.routineStrictness && <p className="text-xs text-red-700">{errors.routineStrictness.message}</p>}
      </div>

      {/* Adaptability */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-stone-900 flex items-center gap-1">
          <RefreshCw className="size-3.5" /> Adaptability
        </label>
        <CustomSelect
          value={watchAdapt}
          onChange={(val) => setValue("adaptability", val)}
          options={levelOptions.map(opt => ({
            value: opt.value,
            label: `${opt.label} - ${adaptabilityLabels[opt.value as keyof typeof adaptabilityLabels]}`
          }))}
          placeholder="Select your preference"
          error={Boolean(errors.adaptability)}
          icon={<RefreshCw className="size-3.5" />}
        />
        {errors.adaptability && <p className="text-xs text-red-700">{errors.adaptability.message}</p>}
      </div>

      {/* ========== PASSWORD ========== */}
      <div className="border-b border-stone-200 pb-3 mt-4 mb-2">
        <h3 className="text-sm font-bold text-stone-800">Security</h3>
      </div>

      {/* Password + Confirm */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-stone-900">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400" strokeWidth={1.5} />
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
              {showPassword ? <EyeOff className="size-4" strokeWidth={1.5} /> : <Eye className="size-4" strokeWidth={1.5} />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-700">{errors.password.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-stone-900">Confirm password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400" strokeWidth={1.5} />
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
              {showConfirmPassword ? <EyeOff className="size-4" strokeWidth={1.5} /> : <Eye className="size-4" strokeWidth={1.5} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-xs text-red-700">{errors.confirmPassword.message}</p>}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="group mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-stone-950 px-5 text-sm font-semibold text-white shadow-[0_28px_80px_-34px_rgba(0,0,0,0.92)] transition hover:bg-stone-800 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" strokeWidth={1.5} />
            Submitting...
          </>
        ) : (
          <>
            Submit Registration
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
          </>
        )}
      </button>
    </form>
  );
}
// app/(auth)/register/_components/utils.ts
import axios from "axios";

const STATUS_MESSAGES: Record<number, string> = {
  400: "The information you entered is invalid. Please check and try again.",
  401: "Your session has expired. Please try again.",
  403: "You don't have permission to perform this action.",
  404: "The requested information could not be found.",
  409: "This email is already registered. Please use a different email or log in instead.",
  422: "The submitted data is invalid. Please check and try again.",
  429: "You're doing that too fast. Please wait a moment and try again.",
  500: "Something went wrong on our end. Please try again later.",
  502: "Something went wrong on our end. Please try again later.",
  503: "The system is under maintenance. Please try again later.",
};

export function getErrorMessage(error: unknown): string {
  // Error from axios (API responded with a status code)
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const serverMessage = (error.response?.data as any)?.message;

    // Prefer the backend's own message; fall back to a status-based message
    if (serverMessage && typeof serverMessage === "string") {
      return serverMessage;
    }
    if (status && STATUS_MESSAGES[status]) {
      return STATUS_MESSAGES[status];
    }
    if (!error.response) {
      return "Unable to connect to the server. Please check your network and try again.";
    }
    return "Something went wrong. Please try again.";
  }

  // A plain Error, not from axios
  if (error instanceof Error) {
    return error.message;
  }

  return "Registration failed. Please try again.";
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export function getLevelLabel(value: string, labels: Record<string, string>): string {
  return labels[value] || "";
}
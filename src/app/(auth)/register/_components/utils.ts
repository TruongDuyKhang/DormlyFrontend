// app/(auth)/register/_components/utils.ts

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
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
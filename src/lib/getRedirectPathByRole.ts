export function getRedirectPathByRole(roles: string[]): string {
  const normalized = roles.map((r) => r.toLowerCase());

  // Platform roles: Manager, Admin, Staff
  if (normalized.some((r) => ["manager", "admin", "staff"].includes(r))) {
    return "/platform/dashboard";
  }

  // Student role: User
  if (normalized.some((r) => r === "user")) {
    return "/student/home";
  }

  // Fallback an toàn
  return "/login";
}
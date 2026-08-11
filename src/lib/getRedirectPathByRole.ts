export function getRedirectPathByRole(roles: string[] = []): string {
  if (!roles || roles.length === 0) {
    return "/student/home";
  }

  const normalized = roles.map((r) => r.toLowerCase().replace("role_", ""));

  // Platform roles: Manager, Admin, Staff
  if (normalized.some((r) => ["manager", "admin", "staff"].includes(r))) {
    return "/platform/dashboard";
  }

  // Student roles: Student, User, Resident
  if (normalized.some((r) => ["student", "user", "resident"].includes(r))) {
    return "/student/home";
  }

  // Default fallback for authenticated accounts
  return "/student/home";
}
import { useAuth } from "@/app/(auth)/context/auth-context";
import { UserRole, ROLE_PERMISSIONS, Permission } from "@/types/auth";

export function useAuthorization() {
  const { user } = useAuth();

  const userRoles = user?.roles ?? [];
  const primaryRole = userRoles.length > 0 ? userRoles[0] : null;
  
  const mappedRole = primaryRole ? mapRoleToEnum(primaryRole) : null;
  
  const permissions = mappedRole ? ROLE_PERMISSIONS[mappedRole] : null;

  return {
    roles: userRoles,
    role: mappedRole,
    permissions,
    hasRole: (requiredRole: UserRole) => mappedRole === requiredRole,
    hasAnyRole: (requiredRoles: UserRole[]) => {
      if (!mappedRole) return false;
      return requiredRoles.includes(mappedRole);
    },
    hasAnyRoleString: (requiredRoles: string[]) => {
      return userRoles.some((r) => 
        requiredRoles.some((req) => r.toLowerCase() === req.toLowerCase())
      );
    },
    hasPermission: (permission: Permission) => {
      if (!permissions) return false;
      return permissions[permission] === true;
    },
    hasAnyOfRoles: (roleList: string[]) => {
      return userRoles.some((r) =>
        roleList.some((rl) => r.toLowerCase() === rl.toLowerCase())
      );
    },
  };
}

function mapRoleToEnum(role: string): UserRole | null {
  const roleMap: Record<string, UserRole> = {
    'user': UserRole.STUDENT,
    'manager': UserRole.STUDENT_MANAGER,
    'staff': UserRole.INCIDENT_MANAGER,
    'admin': UserRole.SUPER_ADMIN,
  };
  
  const normalized = role.toLowerCase();
  return roleMap[normalized] ?? null;
}
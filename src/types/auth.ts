export enum UserRole {
  STUDENT = "User",
  STUDENT_MANAGER = "Manager",
  INCIDENT_MANAGER = "Staff",
  SUPER_ADMIN = "Admin",
}

export type Permission =
  | "canManageStudents"
  | "canViewIncidents"
  | "canResolveIncidents"
  | "canCreateIncidentReport"
  | "canViewReports"
  | "canManageRooms"
  | "canManageAccounts";

export const ROLE_PERMISSIONS: Record<UserRole, Record<Permission, boolean>> = {
  [UserRole.STUDENT]: {
    canManageStudents: false,
    canViewIncidents: false,
    canResolveIncidents: false,
    canCreateIncidentReport: true,
    canViewReports: false,
    canManageRooms: false,
    canManageAccounts: false,
  },
  [UserRole.STUDENT_MANAGER]: {
    canManageStudents: true,
    canViewIncidents: false,
    canResolveIncidents: false,
    canCreateIncidentReport: false,
    canViewReports: true,
    canManageRooms: true,
    canManageAccounts: false,
  },
  [UserRole.INCIDENT_MANAGER]: {
    canManageStudents: false,
    canViewIncidents: true,
    canResolveIncidents: true,
    canCreateIncidentReport: true,
    canViewReports: true,
    canManageRooms: false,
    canManageAccounts: false,
  },
  [UserRole.SUPER_ADMIN]: {
    canManageStudents: true,
    canViewIncidents: true,
    canResolveIncidents: true,
    canCreateIncidentReport: true,
    canViewReports: true,
    canManageRooms: true,
    canManageAccounts: true,
  },
};

export interface AuthUser {
  id: string;
  fullname: string;
  email: string;
  phonenumber?: string;
  roles: string[]; 
}

export interface TokenData {
  accessToken: string;
}
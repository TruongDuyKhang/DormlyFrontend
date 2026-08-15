// Complete data models mapping from Dormly Backend (Spring Boot 3.5)

// ================= AUTH MODELS =================
export interface LoginRequest {
  email: string;
  password?: string;
}

export interface RegisterRequest {
  email: string;
  password?: string;
  fullName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: "MALE" | "FEMALE" | "OTHER" | string;
  code?: string;
}

export interface ForgotPasswordRequest {
  email: string;
  newPassword?: string;
  code?: string;
}

export interface FirebaseLoginRequest {
  token: string;
  idToken?: string;
}

export interface AuthTokensResponse {
  accessToken: string;
  fullName: string;
  roles: string[];
}

// ================= USER MODELS =================
export interface UserResponseDto {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  isActive: boolean;
  roles: string[];
  gender?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface UserRequest {
  email: string;
  password?: string;
  fullName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  roles?: string[];
  avatar?: string;
}

export interface ChangePasswordRequest {
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

// ================= STUDENT PROFILE MODELS =================
export interface StudentProfileResponseDto {
  id: string;
  studentCode?: string;
  major?: string;
  identityNumber?: string;
  startYear?: number;
  endYear?: number;
  sleepTime?: string;
  wakeUpTime?: string;
  sleepScore?: number;
  wakeScore?: number;
  quietPreference?: number;
  quietPreferenceScore?: number;
  socialPreference?: number;
  socialPreferenceScore?: number;
  studyHabit?: number;
  studyHabitScore?: number;
  routineStrictness?: number;
  routineStrictnessScore?: number;
  adaptability?: number;
  adaptabilityScore?: number;
  roommatePreference?: string;
  friendName?: string;
  friendStudentId?: string;
  friendBlock?: string;
  friendFloor?: string;
  friendRoom?: string;
  sleepRhythmScore?: number;
  wakeRhythmScore?: number;
  calculationVersion?: string;
  calculatedAt?: string;
  traits?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentProfileRequest {
  studentCode?: string;
  major?: string;
  identityNumber?: string;
  startYear?: number;
  endYear?: number;
  sleepTime?: string;
  wakeUpTime?: string;
  quietPreference?: number;
  socialPreference?: number;
  studyHabit?: number;
  routineStrictness?: number;
  adaptability?: number;
  roommatePreference?: string;
  friendName?: string;
  friendStudentId?: string;
  friendBlock?: string;
  friendFloor?: string;
  friendRoom?: string;
  traits?: string[];
}

// ================= USER DOCUMENT MODELS =================
export type DocumentType = "CITIZEN_ID" | "STUDENT_CARD" | "OTHER" | string;
export type DocumentStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface UserDocumentResponseDto {
  id: string;
  userId: string;
  documentType: DocumentType;
  fileName: string;
  originalFileName: string;
  fileSize: number;
  contentType: string;
  fileUrl: string;
  status: DocumentStatus;
  rejectReason?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminDocumentStatusRequest {
  status: DocumentStatus;
  rejectReason?: string;
}

// ================= BUILDING & NODE MODELS =================
export type GenderPolicy = "MALE" | "FEMALE" | "COED" | "ALL" | string;

export interface BuildingNodeResponseDto {
  id: string;
  parentId?: string;
  nodeTypeId: string;
  name: string;
  description?: string;
  maxCapacity?: number;
  currentOccupancy?: number;
  genderPolicy?: GenderPolicy;
  status?: string;
  children?: BuildingNodeResponseDto[];
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface BuildingNodeRequest {
  parentId?: string;
  nodeTypeId: string;
  name: string;
  description?: string;
  maxCapacity?: number;
  genderPolicy?: GenderPolicy;
  status?: string;
}

export interface NodeTypeResponseDto {
  id: string;
  name: string;
  level: number;
  description?: string;
}

export interface NodeTypeRequest {
  name: string;
  level: number;
  description?: string;
}

// ================= ROOM ASSIGNMENT MODELS =================
export interface RoomAssignmentResponseDto {
  id: string;
  userId: string;
  roomNodeId: string;
  startDate: string;
  endDate?: string;
  status: string;
  assignedBy?: string;
  contractUrl?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RoomAssignmentRequest {
  userId: string;
  roomNodeId: string;
  startDate: string;
  endDate?: string;
  assignedBy?: string;
  contractUrl?: string;
  notes?: string;
}

export interface CurrentRoomResponseDto {
  roomAssignmentId: string;
  roomNodeId: string;
  startDate: string;
  endDate?: string;
  assignedBy?: string;
  contractUrl?: string;
  notes?: string;
}

export interface RoomHistoryResponseDto {
  id: string;
  roomNodeId: string;
  roomName?: string;
  startDate: string;
  endDate?: string;
  status: string;
  contractUrl?: string;
  notes?: string;
}

// ================= TRANSFER REQUEST MODELS =================
export type TransferRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface TransferRequestResponseDto {
  id: string;
  userId: string;
  fromRoomId?: string;
  toRoomId?: string;
  reason: string;
  status: TransferRequestStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNote?: string;
  createdAt: string;
}

export interface RoomTransferRequest {
  reason: string;
}

export interface TransferRequestStatusUpdateRequest {
  status: TransferRequestStatus;
  reviewNote?: string;
  adminNotes?: string;
  toRoomId?: string;
}

// ================= TICKET MODELS =================
export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type TicketCategory =
  | "FACILITY"
  | "ELECTRICITY"
  | "WATER"
  | "INTERNET"
  | "CLEANLINESS"
  | "SECURITY"
  | "NOISE"
  | "OTHER";

export interface TicketSummaryResponseDto {
  id: string;
  code: string;
  title: string;
  category: TicketCategory;
  status: TicketStatus;
  priority: TicketPriority;
  dueDate?: string;
  reporterName?: string;
  buildingNodeName?: string;
  assignees?: TicketAssigneeResponseDto[];
  commentCount?: number;
  attachmentCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface TicketDetailResponseDto {
  id: string;
  code: string;
  title: string;
  description: string;
  category: TicketCategory;
  status: TicketStatus;
  priority: TicketPriority;
  dueDate?: string;
  reporterId: string;
  reporterName?: string;
  buildingNodeId?: string;
  buildingNodeName?: string;
  assignees?: TicketAssigneeResponseDto[];
  resolutionNote?: string;
  resolvedAt?: string;
  closedAt?: string;
  attachments?: TicketAttachmentResponseDto[];
  comments?: TicketCommentResponseDto[];
  createdAt: string;
}

export interface TicketAssigneeResponseDto {
  userId: string;
  fullName: string;
  email?: string;
  assignedAt?: string;
}

export interface TicketAttachmentResponseDto {
  id: string;
  originalFileName: string;
  storedFileName: string;
  fileSize: number;
  contentType: string;
  fileUrl: string;
  createdAt: string;
}

export interface TicketCommentResponseDto {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  attachments?: TicketAttachmentResponseDto[];
  createdAt: string;
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  category: TicketCategory;
  buildingNodeId?: string;
}

export interface CreateTicketCommentRequest {
  content: string;
}

export interface TicketStatusUpdateRequest {
  status: TicketStatus;
  resolutionNote?: string;
}

export interface TicketPriorityUpdateRequest {
  priority: TicketPriority;
}

export interface TicketDueDateUpdateRequest {
  dueDate: string; // ISO format date (YYYY-MM-DD)
}

export interface TicketAssigneesUpdateRequest {
  assigneeIds: string[];
}

export interface TicketFilterParams {
  status?: TicketStatus;
  priority?: TicketPriority;
  category?: TicketCategory;
  reporterId?: string;
  code?: string;
  assigneeId?: string;
  overdue?: boolean;
  page?: number;
  size?: number;
}

// ================= INVOICE MODELS =================
export type FeeCategory = "ROOM_FEE" | "ELECTRICITY" | "WATER" | "INTERNET" | "SERVICE" | "PENALTY" | "OTHER";
export type InvoiceStatus = "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";

export interface InvoiceResponseDto {
  id: string;
  roomAssignmentId?: string;
  roomId?: string;
  roomName?: string;
  blockName?: string;
  studentId?: string;
  studentName?: string;
  feeCategory: FeeCategory;
  amount: number;
  status: InvoiceStatus;
  month?: string;
  dueDate?: string;
  paidAt?: string;
  paymentQrCodeUrl?: string;
  notes?: string;
}

export interface InvoiceRequestDto {
  roomAssignmentId: string;
  feeCategory: FeeCategory;
  amount: number;
  month: string;
  dueDate?: string;
  notes?: string;
}

// ================= ANNOUNCEMENT MODELS =================
export interface AnnouncementResponseDto {
  id: string;
  title: string;
  content: string;
  priority?: "NORMAL" | "IMPORTANT" | "URGENT" | string;
  author?: string;
  createdAt: string;
}

export interface AnnouncementRequestDto {
  title: string;
  content: string;
  priority?: string;
}

// ================= NOTIFICATION MODELS =================
export type ChannelType = "EMAIL" | "SMS" | "PUSH" | "WEBSOCKET" | "FCM";

export interface NotificationRequest {
  recipient: string;
  subject: string;
  message: string;
  channel: ChannelType;
  metadata?: string;
}

export interface NotificationLog {
  id: string;
  eventId: string;
  recipient: string;
  channel: ChannelType;
  subject: string;
  message?: string;
  status: "QUEUED" | "SENT" | "FAILED";
  errorMessage?: string;
  createdAt: string;
  updatedAt?: string;
}

// ================= AUDIT LOG MODELS =================
export interface AuditLogResponseDto {
  id: string;
  userId?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  oldValue?: string;
  newValue?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface AuditLogCreateRequest {
  action: string;
  entityType?: string;
  entityId?: string;
  oldValue?: string;
  newValue?: string;
}

// ================= RBAC & NAVIGATION MODELS =================
export interface RoleResponseDto {
  id: string;
  name: string;
  description?: string;
  permissions?: PermissionResponseDto[];
}

export interface RoleRequest {
  name: string;
  description?: string;
  permissionIds?: string[];
}

export interface PermissionResponseDto {
  id: string;
  name: string;
  description?: string;
}

export interface PermissionRequest {
  name: string;
  description?: string;
}

export interface NavigationResponseDto {
  id: string;
  parentId?: string;
  name: string;
  path: string;
  icon?: string;
  orderNumber?: number;
  roles?: string[];
  children?: NavigationResponseDto[];
}

export interface NavigationRequest {
  parentId?: string;
  name: string;
  path: string;
  icon?: string;
  orderNumber?: number;
  roleIds?: string[];
}

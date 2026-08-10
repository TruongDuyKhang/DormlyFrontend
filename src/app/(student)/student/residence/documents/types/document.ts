export type DocumentType =
  | "CCCD_FRONT"
  | "CCCD_BACK"
  | "STUDENT_CARD"
  | "TEMPORARY_RESIDENCE"
  | "OTHER";

export type DocumentStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface UserDocument {
  id: string;
  documentType: DocumentType;
  fileUrl: string;
  status: DocumentStatus;
  rejectReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export const DOCUMENT_TYPE_LABEL: Record<DocumentType, string> = {
  CCCD_FRONT: "Citizen ID (Front)",
  CCCD_BACK: "Citizen ID (Back)",
  STUDENT_CARD: "Student Card",
  TEMPORARY_RESIDENCE: "Temporary Residence Form",
  OTHER: "Other Document",
};

// 4 loại bắt buộc hiển thị trên UI, kể cả khi chưa upload.
// "OTHER" chưa hiển thị trên UI (backend hỗ trợ trước, UI làm sau).
export const REQUIRED_DOCUMENT_TYPES: DocumentType[] = [
  "CCCD_FRONT",
  "CCCD_BACK",
  "STUDENT_CARD",
  "TEMPORARY_RESIDENCE",
];

export const STATUS_LABEL: Record<DocumentStatus, string> = {
  PENDING: "Pending Review",
  APPROVED: "Verified",
  REJECTED: "Rejected",
};

export const STATUS_TONE: Record<DocumentStatus, "verified" | "pending" | "rejected"> = {
  PENDING: "pending",
  APPROVED: "verified",
  REJECTED: "rejected",
};

export interface DisplayDocument {
  documentType: DocumentType;
  name: string;
  uploaded: boolean;
  status?: DocumentStatus;
  verificationLabel: string;
  tone: "verified" | "pending" | "rejected" | "neutral";
  updatedAt?: string;
  fileUrl?: string;
  rejectReason?: string | null;
  id?: string;
}

function toDisplayDocument(found: UserDocument): DisplayDocument {
  return {
    documentType: found.documentType,
    name: DOCUMENT_TYPE_LABEL[found.documentType] ?? found.documentType,
    uploaded: true,
    status: found.status,
    verificationLabel: STATUS_LABEL[found.status] ?? found.status,
    tone: STATUS_TONE[found.status] ?? "neutral",
    updatedAt: found.updatedAt,
    fileUrl: found.fileUrl,
    rejectReason: found.rejectReason,
    id: found.id,
  };
}

// Ghép danh sách bắt buộc với dữ liệu thật từ API.
// Loại OTHER bị lọc bỏ khỏi hiển thị vì UI hiện chưa hỗ trợ.
export function mergeWithRequiredDocuments(
  fetched: UserDocument[]
): DisplayDocument[] {
  return REQUIRED_DOCUMENT_TYPES.map(type => {
    const found = fetched.find(d => d.documentType === type);
    if (!found) {
      return {
        documentType: type,
        name: DOCUMENT_TYPE_LABEL[type],
        uploaded: false,
        verificationLabel: "Not uploaded",
        tone: "neutral" as const,
      };
    }
    return toDisplayDocument(found);
  });
}
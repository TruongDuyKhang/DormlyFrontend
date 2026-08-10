"use client";

import { useRef, useState } from "react";
import {
  X,
  Wrench,
  Building2,
  Users,
  ShieldAlert,
  Receipt,
  HelpCircle,
  Upload,
  XCircle,
  Loader2,
} from "lucide-react";
import type { CreateTicketPayload, TicketCategory } from "../types/ticket";

interface CreateRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (payload: CreateTicketPayload, files: File[]) => Promise<unknown>;
}

const categoryOptions: {
  id: TicketCategory;
  label: string;
  icon: any;
  description: string;
}[] = [
  {
    id: "MAINTENANCE",
    label: "Maintenance",
    icon: Wrench,
    description: "Electrical, plumbing, internet, furniture...",
  },
  {
    id: "FACILITY",
    label: "Facility",
    icon: Building2,
    description: "Common area, elevator, shared equipment...",
  },
  {
    id: "ROOMMATE",
    label: "Roommate",
    icon: Users,
    description: "Conflict, noise, cleanliness with roommate...",
  },
  {
    id: "SECURITY",
    label: "Security",
    icon: ShieldAlert,
    description: "Safety, unauthorized access, theft...",
  },
  {
    id: "BILLING",
    label: "Billing",
    icon: Receipt,
    description: "Invoice, payment, fee questions...",
  },
  {
    id: "OTHER",
    label: "Other",
    icon: HelpCircle,
    description: "Anything else",
  },
];

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "application/pdf",
];

export function CreateRequestModal({
  isOpen,
  onClose,
  onCreate,
}: CreateRequestModalProps) {
  const [step, setStep] = useState<"type" | "form">("type");
  const [category, setCategory] = useState<TicketCategory | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleCategorySelect = (id: TicketCategory) => {
    setCategory(id);
    setStep("form");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFileError(null);

    const combined = [...attachments, ...files];
    if (combined.length > MAX_FILES) {
      setFileError(`Bạn chỉ được đính kèm tối đa ${MAX_FILES} file.`);
      return;
    }
    const invalid = files.find((f) => !ALLOWED_TYPES.includes(f.type));
    if (invalid) {
      setFileError(
        `File không hỗ trợ: ${invalid.name}. Chỉ nhận PNG/JPEG/GIF/WEBP/PDF.`,
      );
      return;
    }
    const tooBig = files.find((f) => f.size > MAX_FILE_SIZE);
    if (tooBig) {
      setFileError(`"${tooBig.name}" vượt quá 10MB.`);
      return;
    }

    setAttachments(combined);
    setPreviewUrls((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeAttachment = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setAttachments((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setStep("type");
    setCategory(null);
    setTitle("");
    setDescription("");
    setAttachments([]);
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setPreviewUrls([]);
    setFileError(null);
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const handleSubmit = async () => {
    if (!category || !title.trim() || !description.trim()) return;
    setIsSubmitting(true);
    try {
      await onCreate(
        { category, title: title.trim(), description: description.trim() },
        attachments,
      );
      handleClose();
    } catch {

    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-stone-200 bg-white p-4">
          <h2 className="text-xl font-semibold text-stone-900">
            {step === "type"
              ? "New Request"
              : `New ${categoryOptions.find((c) => c.id === category)?.label} Request`}
          </h2>
          <button
            onClick={handleClose}
            className="rounded-full p-1 hover:bg-stone-100"
          >
            <X className="h-5 w-5 text-stone-500" />
          </button>
        </div>

        <div className="p-6">
          {step === "type" ? (
            <div className="space-y-3">
              {categoryOptions.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleCategorySelect(opt.id)}
                    className="flex w-full items-start gap-4 rounded-xl border border-stone-200 p-4 text-left transition hover:border-[#9d7443] hover:bg-stone-50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100">
                      <Icon className="h-5 w-5 text-stone-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-stone-900">
                        {opt.label}
                      </p>
                      <p className="text-sm text-stone-500">
                        {opt.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl bg-stone-50 p-3">
                <p className="text-xs text-stone-500">Location</p>
                <p className="mt-1 text-sm font-medium text-stone-800">
                  Filed against your current room assignment
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={200}
                  placeholder="e.g., Air Conditioner Not Working"
                  className="w-full rounded-xl border border-stone-200 p-3 text-sm focus:border-[#9d7443] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your issue in detail..."
                  rows={4}
                  className="w-full rounded-xl border border-stone-200 p-3 text-sm focus:border-[#9d7443] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Attachments (Images / PDF, tối đa 5, mỗi file ≤10MB)
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/gif,image/webp,application/pdf"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
                >
                  <Upload className="h-4 w-4" />
                  Upload Files
                </button>
                {fileError && (
                  <p className="mt-2 text-xs text-red-600">{fileError}</p>
                )}

                {attachments.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {attachments.map((file, idx) => (
                      <div key={idx} className="relative group">
                        {file.type === "application/pdf" ? (
                          <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-stone-200 bg-stone-50 p-1 text-center text-xs text-stone-500">
                            {file.name}
                          </div>
                        ) : (
                          <img
                            src={previewUrls[idx]}
                            alt={`Preview ${idx + 1}`}
                            className="h-20 w-20 rounded-lg object-cover border border-stone-200"
                          />
                        )}
                        <button
                          onClick={() => removeAttachment(idx)}
                          className="absolute -top-2 -right-2 rounded-full bg-red-500 p-0.5 text-white opacity-0 group-hover:opacity-100 transition"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>


            </div>
          )}
        </div>

        <div className="sticky bottom-0 flex justify-end gap-3 border-t border-stone-200 bg-white p-4">
          {step === "form" && (
            <button
              onClick={() => setStep("type")}
              disabled={isSubmitting}
              className="rounded-full px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 disabled:opacity-50"
            >
              Back
            </button>
          )}
          <button
            onClick={step === "type" ? handleClose : handleSubmit}
            disabled={
              step === "form" &&
              (!title.trim() || !description.trim() || isSubmitting)
            }
            className="inline-flex items-center gap-2 rounded-full bg-[#2f2a24] px-6 py-2 text-sm font-medium text-white transition hover:bg-[#40382f] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {step === "type"
              ? "Cancel"
              : isSubmitting
                ? "Submitting..."
                : "Submit Request"}
          </button>
        </div>
      </div>
    </div>
  );
}

// app/(student)/requests/_components/create-request-modal.tsx
"use client";

import { useState, useRef } from "react";
import { X, Wrench, MessageSquare, ArrowRight, Upload, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: any) => void;
  userLocation?: string; // Thêm prop location từ thông tin sinh viên
}

const requestTypes = [
  { id: "maintenance", label: "Maintenance", icon: Wrench, description: "Electrical, plumbing, internet, furniture..." },
  { id: "complaint", label: "Complaint", icon: MessageSquare, description: "Noise, cleanliness, conflict..." },
  { id: "transfer", label: "Room Transfer", icon: ArrowRight, description: "Request room change with reason" },
];

const maintenanceSubTypes = [
  "Electrical", "Plumbing", "Internet", "Furniture", "Equipment", "Hygiene"
];

const complaintSubTypes = [
  "Noise", "Cleanliness", "Conflict", "Rule Violation", "Other"
];

export function CreateRequestModal({ isOpen, onClose, onCreate, userLocation = "Room A304, Block A, Floor 3" }: CreateRequestModalProps) {
  const [step, setStep] = useState<"type" | "form">("type");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [subType, setSubType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setStep("form");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setAttachments(prev => [...prev, ...files]);
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removeAttachment = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setAttachments(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    onCreate({
      type: selectedType,
      subType,
      title,
      description,
      location: userLocation, // Tự động lấy từ thông tin sinh viên
      attachments,
    });
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setStep("type");
    setSelectedType(null);
    setTitle("");
    setDescription("");
    setSubType("");
    setAttachments([]);
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setPreviewUrls([]);
  };

  const subTypes = selectedType === "maintenance" 
    ? maintenanceSubTypes 
    : selectedType === "complaint" 
    ? complaintSubTypes 
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-stone-200 bg-white p-4">
          <h2 className="text-xl font-semibold text-stone-900">
            {step === "type" ? "New Request" : `New ${selectedType} Request`}
          </h2>
          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="rounded-full p-1 hover:bg-stone-100"
          >
            <X className="h-5 w-5 text-stone-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === "type" ? (
            <div className="space-y-3">
              {requestTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => handleTypeSelect(type.id)}
                    className="flex w-full items-start gap-4 rounded-xl border border-stone-200 p-4 text-left transition hover:border-[#9d7443] hover:bg-stone-50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100">
                      <Icon className="h-5 w-5 text-stone-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-stone-900">{type.label}</p>
                      <p className="text-sm text-stone-500">{type.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Location - Hiển thị tự động, không cho sửa */}
              <div className="rounded-xl bg-stone-50 p-3">
                <p className="text-xs text-stone-500">Location (auto-detected)</p>
                <p className="mt-1 text-sm font-medium text-stone-800">{userLocation}</p>
              </div>

              {/* Sub Type */}
              {subTypes.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Sub Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {subTypes.map((st) => (
                      <button
                        key={st}
                        onClick={() => setSubType(st)}
                        className={cn(
                          "rounded-full px-3 py-1.5 text-sm transition",
                          subType === st
                            ? "bg-[#2f2a24] text-white"
                            : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                        )}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Air Conditioner Not Working"
                  className="w-full rounded-xl border border-stone-200 p-3 text-sm focus:border-[#9d7443] focus:outline-none"
                />
              </div>

              {/* Description */}
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

              {/* Attachments */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Attachments (Photos / Videos)
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
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
                
                {/* Preview images */}
                {previewUrls.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {previewUrls.map((url, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={url}
                          alt={`Preview ${idx + 1}`}
                          className="h-20 w-20 rounded-lg object-cover border border-stone-200"
                        />
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

        {/* Footer */}
        <div className="sticky bottom-0 flex justify-end gap-3 border-t border-stone-200 bg-white p-4">
          {step === "form" && (
            <button
              onClick={() => setStep("type")}
              className="rounded-full px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100"
            >
              Back
            </button>
          )}
          <button
            onClick={step === "type" ? onClose : handleSubmit}
            className="rounded-full bg-[#2f2a24] px-6 py-2 text-sm font-medium text-white transition hover:bg-[#40382f]"
          >
            {step === "type" ? "Cancel" : "Submit Request"}
          </button>
        </div>
      </div>
    </div>
  );
}
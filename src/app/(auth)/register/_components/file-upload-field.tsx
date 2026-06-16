// app/(auth)/register/_components/file-upload-field.tsx
"use client";

import { useState, useRef } from "react";
import { Upload, FileText, CheckCircle, XCircle } from "lucide-react";
import { MAX_FILE_SIZE, ACCEPTED_FILE_TYPES } from "./constants";
import { formatFileSize } from "./utils";
import type { FileWithPreview } from "./register-types";

interface FileUploadFieldProps {
  label: string;
  required?: boolean;
  accept?: string;
  onFileSelect: (file: File | null) => void;
  error?: string;
}

export function FileUploadField({ label, required, accept, onFileSelect, error }: FileUploadFieldProps) {
  const [file, setFile] = useState<FileWithPreview | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (selectedFile: File | null) => {
    if (!selectedFile) {
      setFile(null);
      onFileSelect(null);
      return;
    }

    if (!ACCEPTED_FILE_TYPES.includes(selectedFile.type)) {
      setFile({
        file: selectedFile,
        preview: "",
        name: selectedFile.name,
        size: formatFileSize(selectedFile.size),
        status: "error",
        error: "Only JPG, PNG, or PDF files are allowed",
      });
      onFileSelect(null);
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setFile({
        file: selectedFile,
        preview: "",
        name: selectedFile.name,
        size: formatFileSize(selectedFile.size),
        status: "error",
        error: "File size must be less than 5MB",
      });
      onFileSelect(null);
      return;
    }

    const preview = selectedFile.type.startsWith("image/") ? URL.createObjectURL(selectedFile) : "";

    setFile({
      file: selectedFile,
      preview,
      name: selectedFile.name,
      size: formatFileSize(selectedFile.size),
      status: "success",
    });
    onFileSelect(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileChange(droppedFile);
    }
  };

  const removeFile = () => {
    if (file?.preview) {
      URL.revokeObjectURL(file.preview);
    }
    setFile(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-1">
      <label className="text-sm font-semibold text-stone-900">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition ${
            isDragging
              ? "border-[#9d7443] bg-amber-50"
              : error
              ? "border-red-400 bg-red-50/30"
              : "border-stone-300 hover:border-[#9d7443] hover:bg-amber-50/30"
          }`}
        >
          <Upload className="mx-auto h-8 w-8 text-stone-400" />
          <p className="mt-2 text-sm text-stone-600">Click or drag & drop to upload</p>
          <p className="mt-1 text-xs text-stone-400">JPG, PNG, or PDF (max 5MB)</p>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept || "image/jpeg,image/png,image/jpg,application/pdf"}
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            className="hidden"
          />
        </div>
      ) : (
        <div className={`rounded-2xl border p-4 ${
          file.status === "error" ? "border-red-400 bg-red-50/30" : "border-emerald-200 bg-emerald-50/30"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {file.preview ? (
                <img src={file.preview} alt="Preview" className="h-12 w-12 rounded-lg object-cover" />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-stone-100">
                  <FileText className="h-6 w-6 text-stone-500" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-stone-900">{file.name}</p>
                <p className="text-xs text-stone-500">{file.size}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {file.status === "success" && <CheckCircle className="h-5 w-5 text-emerald-500" />}
              {file.status === "error" && <XCircle className="h-5 w-5 text-red-500" />}
              <button
                type="button"
                onClick={removeFile}
                className="rounded-full p-1 text-stone-400 transition hover:bg-stone-100 hover:text-red-500"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </div>
          </div>
          {file.error && <p className="mt-2 text-xs text-red-500">{file.error}</p>}
        </div>
      )}
      {error && !file && <p className="text-xs text-red-700">{error}</p>}
    </div>
  );
}
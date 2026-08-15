"use client";

import { useRef, useState } from "react";
import {
  X,
  Calendar,
  Clock,
  Paperclip,
  Download,
  Send,
  MessageCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { RequestTimeline } from "./request-timeline";
import { ticketService } from "../services/ticketService";
import type { TicketDetail } from "../types/ticket";

interface RequestDetailModalProps {
  ticket: TicketDetail | null;
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onAddComment: (body: string, files: File[]) => Promise<unknown>;
}

const statusConfig: Record<
  TicketDetail["status"],
  { label: string; color: string }
> = {
  OPEN: { label: "Open", color: "bg-amber-500 text-white" },
  IN_PROGRESS: { label: "In Progress", color: "bg-sky-600 text-white" },
  RESOLVED: { label: "Resolved", color: "bg-emerald-600 text-white" },
  REJECTED: { label: "Rejected", color: "bg-red-600 text-white" },
  CLOSED: { label: "Closed", color: "bg-stone-500 text-white" },
};

const categoryConfig: Record<
  TicketDetail["category"],
  { label: string; color: string }
> = {
  MAINTENANCE: { label: "Maintenance", color: "bg-sky-600 text-white" },
  FACILITY: { label: "Facility", color: "bg-teal-600 text-white" },
  ROOMMATE: { label: "Roommate", color: "bg-amber-600 text-white" },
  TRANSFER: { label: "Room Transfer", color: "bg-indigo-600 text-white" },
  SECURITY: { label: "Security", color: "bg-red-600 text-white" },
  BILLING: { label: "Billing", color: "bg-violet-600 text-white" },
  OTHER: { label: "Other", color: "bg-stone-500 text-white" },
};

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "application/pdf",
];
const SETTLED_STATUSES: TicketDetail["status"][] = ["CLOSED", "REJECTED"];

export function RequestDetailModal({
  ticket,
  isOpen,
  isLoading,
  onClose,
  onAddComment,
}: RequestDetailModalProps) {
  const [newComment, setNewComment] = useState("");
  const [commentAttachments, setCommentAttachments] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFileError(null);
    const combined = [...commentAttachments, ...files];
    if (combined.length > MAX_FILES) {
      setFileError(`Bạn chỉ được đính kèm tối đa ${MAX_FILES} file.`);
      return;
    }
    const invalid = files.find((f) => !ALLOWED_TYPES.includes(f.type));
    if (invalid) {
      setFileError(`File không hỗ trợ: ${invalid.name}.`);
      return;
    }
    const tooBig = files.find((f) => f.size > MAX_FILE_SIZE);
    if (tooBig) {
      setFileError(`"${tooBig.name}" vượt quá 10MB.`);
      return;
    }
    setCommentAttachments(combined);
    setPreviewUrls((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeAttachment = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setCommentAttachments((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddComment = async () => {
    if (!newComment.trim() && commentAttachments.length === 0) return;
    setIsSending(true);
    try {
      await onAddComment(newComment.trim(), commentAttachments);
      setNewComment("");
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      setCommentAttachments([]);
      setPreviewUrls([]);
    } catch {
    } finally {
      setIsSending(false);
    }
  };

  const isSettled = ticket ? SETTLED_STATUSES.includes(ticket.status) : false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative flex h-[90vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex-shrink-0 border-b border-stone-200 bg-white p-4 rounded-t-2xl">
          <div className="flex items-start justify-between">
            {ticket && !isLoading ? (
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${categoryConfig[ticket.category].color}`}
                  >
                    {categoryConfig[ticket.category].label}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusConfig[ticket.status].color}`}
                  >
                    {statusConfig[ticket.status].label}
                  </span>
                  <span className="text-xs text-stone-400">{ticket.code}</span>
                </div>
                <h2 className="mt-2 text-2xl font-semibold text-stone-900">
                  {ticket.title}
                </h2>
                {ticket.buildingNodeName && (
                  <p className="mt-1 text-sm text-stone-500">
                    {ticket.buildingNodeName}
                  </p>
                )}
              </div>
            ) : (
              <div className="text-sm text-stone-500">Loading request...</div>
            )}
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-stone-100 flex-shrink-0"
            >
              <X className="h-5 w-5 text-stone-500" />
            </button>
          </div>
        </div>

        {isLoading || !ticket ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-stone-400" />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-stone-900">
                  Description
                </h3>
                <p className="mt-2 text-sm text-stone-600 leading-relaxed">
                  {ticket.description}
                </p>
              </div>

              {ticket.attachments.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-stone-900">
                    Attachments
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-3">
                    {ticket.attachments.map((file) => {
                      const href = ticketService.attachmentUrl(file.url);
                      return (
                        <a
                          key={file.id}
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          className="group relative"
                        >
                          {file.contentType.startsWith("image/") ? (
                            <img
                              src={href}
                              alt={file.originalFilename}
                              className="h-24 w-24 rounded-lg object-cover border border-stone-200 cursor-pointer hover:opacity-90"
                            />
                          ) : (
                            <div className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-lg border border-stone-200 bg-stone-50 p-2 text-center text-xs text-stone-500">
                              <Paperclip className="h-4 w-4" />
                              {file.originalFilename}
                            </div>
                          )}
                          <span className="absolute bottom-1 right-1 rounded-full bg-black/50 p-1 text-white opacity-0 group-hover:opacity-100 transition">
                            <Download className="h-3 w-3" />
                          </span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 rounded-xl bg-stone-50 p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-stone-400" />
                  <div>
                    <p className="text-xs text-stone-500">Created</p>
                    <p className="text-sm font-medium text-stone-900">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-stone-400" />
                  <div>
                    <p className="text-xs text-stone-500">Due Date</p>
                    <p className="text-sm font-medium text-stone-900">
                      {ticket.dueDate
                        ? new Date(ticket.dueDate).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-stone-900 mb-4">
                  Timeline
                </h3>
                <RequestTimeline ticket={ticket} />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-stone-900 mb-4 flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Comments ({ticket.comments.length})
                </h3>
                <div className="space-y-4 max-h-64 overflow-y-auto mb-4">
                  {ticket.comments.length === 0 && (
                    <p className="text-sm text-stone-400">No comments yet.</p>
                  )}
                  {ticket.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="rounded-xl border border-stone-200 bg-stone-50 p-3"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            comment.authorId === ticket.reporterId
                              ? "bg-[#2f2a24] text-white"
                              : "bg-[#9d7443] text-white"
                          }`}
                        >
                          {comment.authorId === ticket.reporterId
                            ? "You"
                            : comment.authorName}
                        </span>
                        <span className="text-xs text-stone-400">
                          {new Date(comment.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-stone-700">
                        {comment.body}
                      </p>
                      {comment.attachments.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {comment.attachments.map((att) => {
                            const href = ticketService.attachmentUrl(att.url);
                            return (
                              <a
                                key={att.id}
                                href={href}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {att.contentType.startsWith("image/") ? (
                                  <img
                                    src={href}
                                    alt={att.originalFilename}
                                    className="h-12 w-12 rounded object-cover"
                                  />
                                ) : (
                                  <span className="text-xs text-[#9d7443] underline">
                                    {att.originalFilename}
                                  </span>
                                )}
                              </a>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 border-t border-stone-200 bg-white p-4 rounded-b-2xl">
              {isSettled ? (
                <p className="text-center text-sm text-stone-400">
                  This request is{" "}
                  {statusConfig[ticket.status].label.toLowerCase()} and no
                  longer accepts comments.
                </p>
              ) : (
                <>
                  {fileError && (
                    <p className="mb-2 text-xs text-red-600">{fileError}</p>
                  )}
                  {previewUrls.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {commentAttachments.map((file, idx) => (
                        <div key={idx} className="relative group">
                          {file.type === "application/pdf" ? (
                            <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-stone-200 bg-stone-50 p-1 text-center text-[10px] text-stone-500">
                              {file.name}
                            </div>
                          ) : (
                            <img
                              src={previewUrls[idx]}
                              alt={`Preview ${idx + 1}`}
                              className="h-16 w-16 rounded-lg object-cover border border-stone-200"
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
                  <div className="flex items-end gap-3">
                    <div className="flex-1">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        rows={2}
                        className="w-full resize-none rounded-xl border border-stone-200 p-3 text-sm focus:border-[#9d7443] focus:outline-none"
                      />
                    </div>
                    <div className="flex gap-2">
                      <label className="cursor-pointer rounded-full p-2 hover:bg-stone-100 transition">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/png,image/jpeg,image/gif,image/webp,application/pdf"
                          multiple
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                        <Paperclip className="h-5 w-5 text-stone-400" />
                      </label>
                      <button
                        onClick={handleAddComment}
                        disabled={
                          (!newComment.trim() &&
                            commentAttachments.length === 0) ||
                          isSending
                        }
                        className="inline-flex items-center gap-2 rounded-full bg-[#2f2a24] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#40382f] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                        Send
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

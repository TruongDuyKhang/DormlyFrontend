// app/(student)/requests/_components/request-detail-modal.tsx
"use client";

import { useState, useRef } from "react";
import { X, Calendar, Clock, MapPin, Paperclip, Download, Send, Image as ImageIcon, MessageCircle, XCircle } from "lucide-react";
import { RequestTimeline } from "./request-timeline";
import type { Request, Comment } from "./types";

interface RequestDetailModalProps {
  request: Request | null;
  isOpen: boolean;
  onClose: () => void;
  onAddComment?: (requestId: string, comment: string, attachments?: File[]) => void;
}

const statusConfig = {
  pending: { label: "Pending Review", color: "bg-amber-500 text-white" },
  assigned: { label: "Assigned", color: "bg-blue-600 text-white" },
  in_progress: { label: "In Progress", color: "bg-sky-600 text-white" },
  resolved: { label: "Resolved", color: "bg-emerald-600 text-white" },
  rejected: { label: "Rejected", color: "bg-red-600 text-white" },
  approved: { label: "Approved", color: "bg-emerald-600 text-white" },
};

const categoryConfig = {
  maintenance: { label: "Maintenance", color: "bg-sky-600 text-white" },
  complaint: { label: "Complaint", color: "bg-amber-600 text-white" },
  transfer: { label: "Transfer Request", color: "bg-emerald-600 text-white" },
};

export function RequestDetailModal({ request, isOpen, onClose, onAddComment }: RequestDetailModalProps) {
  const [newComment, setNewComment] = useState("");
  const [commentAttachments, setCommentAttachments] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !request) return null;

  const status = statusConfig[request.status];
  const category = categoryConfig[request.category];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setCommentAttachments(prev => [...prev, ...files]);
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removeAttachment = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setCommentAttachments(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddComment = () => {
    if (!newComment.trim() && commentAttachments.length === 0) return;
    onAddComment?.(request.id, newComment, commentAttachments);
    setNewComment("");
    setCommentAttachments([]);
    setPreviewUrls([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative flex h-[90vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex-shrink-0 border-b border-stone-200 bg-white p-4 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${category.color}`}>
                  {category.label}
                </span>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.color}`}>
                  {status.label}
                </span>
              </div>
              <h2 className="mt-2 text-2xl font-semibold text-stone-900">
                {request.title}
              </h2>
              <div className="mt-1 flex items-center gap-3 text-sm text-stone-500">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {request.location}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-stone-100 flex-shrink-0"
            >
              <X className="h-5 w-5 text-stone-500" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-stone-900">Description</h3>
            <p className="mt-2 text-sm text-stone-600 leading-relaxed">
              {request.description}
            </p>
          </div>

          {/* Attachments */}
          {request.attachments.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-stone-900">Attachments</h3>
              <div className="mt-2 flex flex-wrap gap-3">
                {request.attachments.map((file) => (
                  <div key={file.id} className="group relative">
                    {file.type === "image" ? (
                      <img
                        src={file.url}
                        alt={file.name}
                        className="h-24 w-24 rounded-lg object-cover border border-stone-200 cursor-pointer hover:opacity-90"
                      />
                    ) : (
                      <video
                        src={file.url}
                        className="h-24 w-24 rounded-lg object-cover border border-stone-200"
                      />
                    )}
                    <button className="absolute bottom-1 right-1 rounded-full bg-black/50 p-1 text-white opacity-0 group-hover:opacity-100 transition">
                      <Download className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Meta Info */}
          <div className="grid grid-cols-2 gap-4 rounded-xl bg-stone-50 p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-stone-400" />
              <div>
                <p className="text-xs text-stone-500">Created</p>
                <p className="text-sm font-medium text-stone-900">
                  {new Date(request.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-stone-400" />
              <div>
                <p className="text-xs text-stone-500">Last Updated</p>
                <p className="text-sm font-medium text-stone-900">
                  {request.updatedAt}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="text-sm font-semibold text-stone-900 mb-4">Timeline</h3>
            <RequestTimeline timeline={request.timeline} />
          </div>

          {/* Comments Section */}
          <div>
            <h3 className="text-sm font-semibold text-stone-900 mb-4 flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Comments ({request.comments.length})
            </h3>
            
            {/* Comments List */}
            <div className="space-y-4 max-h-64 overflow-y-auto mb-4">
              {request.comments.map((comment) => (
                <div key={comment.id} className="rounded-xl border border-stone-200 bg-stone-50 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        comment.author === "student" 
                          ? "bg-[#2f2a24] text-white" 
                          : "bg-[#9d7443] text-white"
                      }`}>
                        {comment.author === "student" ? "You" : comment.authorName}
                      </span>
                      <span className="text-xs text-stone-400">{comment.createdAt}</span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-stone-700">{comment.content}</p>
                  {comment.attachments && comment.attachments.length > 0 && (
                    <div className="mt-2 flex gap-2">
                      {comment.attachments.map((att) => (
                        <img
                          key={att.id}
                          src={att.url}
                          alt="attachment"
                          className="h-12 w-12 rounded object-cover"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fixed Footer - Comment Input */}
        <div className="flex-shrink-0 border-t border-stone-200 bg-white p-4 rounded-b-2xl">
          {/* Attachment Previews */}
          {previewUrls.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {previewUrls.map((url, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={url}
                    alt={`Preview ${idx + 1}`}
                    className="h-16 w-16 rounded-lg object-cover border border-stone-200"
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
          
          {/* Input Area */}
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
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Paperclip className="h-5 w-5 text-stone-400" />
              </label>
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim() && commentAttachments.length === 0}
                className="inline-flex items-center gap-2 rounded-full bg-[#2f2a24] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#40382f] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
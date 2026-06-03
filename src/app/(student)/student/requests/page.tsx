// app/(student)/requests/page.tsx
"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { RequestCard } from "./_components/request-card";
import { RequestFilters } from "./_components/request-filters";
import { CreateRequestModal } from "./_components/create-request-modal";
import { RequestDetailModal } from "./_components/request-detail-modal";
import type { Request, RequestStatus, TabType, Comment, Attachment } from "./_components/types";

// Mock data với attachments, comments, location
const mockRequests: Request[] = [
  {
    id: "1",
    title: "Air Conditioner Not Working",
    description: "The air conditioner in Room A304 stopped working yesterday evening. It's getting very hot in the room. Please send a technician as soon as possible.",
    location: "Room A304, Block A, Floor 3",
    category: "maintenance",
    subType: "equipment",
    status: "in_progress",
    createdAt: "2024-08-12T10:00:00",
    updatedAt: "2 hours ago",
    attachments: [
      { id: "att1", url: "https://picsum.photos/200/150?random=1", name: "ac_issue.jpg", type: "image" },
      { id: "att2", url: "https://picsum.photos/200/150?random=2", name: "thermostat.jpg", type: "image" },
    ],
    comments: [
      { id: "c1", author: "student", authorName: "You", content: "The AC is not cooling at all. The room temperature is around 32°C.", createdAt: "Aug 12, 2024 - 10:05 AM" },
      { id: "c2", author: "manager", authorName: "Maintenance Team", content: "We've received your request. A technician will be assigned shortly.", createdAt: "Aug 12, 2024 - 10:30 AM" },
      { id: "c3", author: "manager", authorName: "Technician Nam", content: "I'm on my way to check the AC unit.", createdAt: "Aug 13, 2024 - 9:00 AM" },
    ],
    timeline: [
      { id: "t1", date: "Aug 12, 2024", title: "Request Submitted", description: "Your request has been received", status: "pending" },
      { id: "t2", date: "Aug 12, 2024", title: "Assigned To Maintenance Team", description: "Technician has been assigned", status: "assigned" },
      { id: "t3", date: "Aug 13, 2024", title: "Work Started", description: "Technician is on site", status: "in_progress" },
    ],
  },
  {
    id: "2",
    title: "Noise Complaint - Room A305",
    description: "Loud music after 11 PM from neighboring room A305. Unable to sleep properly. This has been happening for 3 consecutive nights.",
    location: "Room A304 (neighbor: A305), Block A, Floor 3",
    category: "complaint",
    subType: "noise",
    status: "pending",
    createdAt: "2024-08-14T14:30:00",
    updatedAt: "Yesterday",
    attachments: [
      { id: "att3", url: "https://picsum.photos/200/150?random=3", name: "noise_video.mp4", type: "video" },
    ],
    comments: [
      { id: "c4", author: "student", authorName: "You", content: "The noise is unbearable. I have exams next week.", createdAt: "Aug 14, 2024 - 2:35 PM" },
    ],
    timeline: [
      { id: "t1", date: "Aug 14, 2024", title: "Request Submitted", description: "Your complaint has been received", status: "pending" },
    ],
  },
  {
    id: "3",
    title: "Room Transfer Request",
    description: "Would like to move to a quieter floor. Current room has constant noise issues from the common area and nearby rooms.",
    location: "Current: Room A304 → Requested: Any room on Floor 5 or higher",
    category: "transfer",
    subType: "other",
    status: "approved",
    createdAt: "2024-08-01T09:00:00",
    updatedAt: "3 days ago",
    attachments: [],
    comments: [
      { id: "c5", author: "student", authorName: "You", content: "I've been having trouble sleeping due to noise from the common area.", createdAt: "Aug 1, 2024 - 9:05 AM" },
      { id: "c6", author: "manager", authorName: "Residence Office", content: "We've reviewed your request. There is an available room on Floor 6. Please come to the office to complete the transfer.", createdAt: "Aug 5, 2024 - 2:00 PM" },
      { id: "c7", author: "student", authorName: "You", content: "Thank you! I'll come by tomorrow morning.", createdAt: "Aug 5, 2024 - 3:30 PM" },
    ],
    timeline: [
      { id: "t1", date: "Aug 1, 2024", title: "Request Submitted", description: "Transfer request received", status: "pending" },
      { id: "t2", date: "Aug 3, 2024", title: "Under Review", description: "Residence office is reviewing", status: "assigned" },
      { id: "t3", date: "Aug 5, 2024", title: "Approved", description: "Your transfer request has been approved", status: "approved" },
    ],
  },
  {
    id: "4",
    title: "Water Leakage in Bathroom",
    description: "Water leaking from the ceiling in the bathroom. This started yesterday and has gotten worse. Urgent repair needed.",
    location: "Room A304, Bathroom, Block A, Floor 3",
    category: "maintenance",
    subType: "plumbing",
    status: "resolved",
    createdAt: "2024-08-10T08:00:00",
    updatedAt: "1 week ago",
    attachments: [
      { id: "att4", url: "https://picsum.photos/200/150?random=4", name: "leakage.jpg", type: "image" },
    ],
    comments: [
      { id: "c8", author: "student", authorName: "You", content: "Water is dripping constantly.", createdAt: "Aug 10, 2024 - 8:05 AM" },
      { id: "c9", author: "manager", authorName: "Plumbing Team", content: "We've fixed the leakage. Please let us know if it happens again.", createdAt: "Aug 11, 2024 - 3:00 PM" },
      { id: "c10", author: "student", authorName: "You", content: "Thank you! It's fixed now.", createdAt: "Aug 11, 2024 - 4:00 PM" },
    ],
    timeline: [
      { id: "t1", date: "Aug 10, 2024", title: "Request Submitted", description: "Urgent maintenance request received", status: "pending" },
      { id: "t2", date: "Aug 10, 2024", title: "Assigned", description: "Plumbing team assigned", status: "assigned" },
      { id: "t3", date: "Aug 11, 2024", title: "Repair Completed", description: "Leakage fixed successfully", status: "resolved" },
    ],
  },
];

const getStatusGroup = (status: RequestStatus): TabType => {
  if (status === "pending" || status === "assigned") return "open";
  if (status === "in_progress") return "in_progress";
  return "completed";
};

export default function RequestsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("open");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [requests, setRequests] = useState<Request[]>(mockRequests);

  const filteredRequests = requests
    .filter((req) => getStatusGroup(req.status) === activeTab)
    .filter((req) => activeCategory === "all" || req.category === activeCategory)
    .filter((req) => 
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const emptyMessages: Record<TabType, { title: string; description: string }> = {
    open: { title: "No Open Requests", description: "You currently have no pending or assigned requests." },
    in_progress: { title: "No Requests In Progress", description: "Your requests are not being processed at the moment." },
    completed: { title: "No Completed Requests", description: "Your completed requests will appear here." },
  };

  const handleCreateRequest = (data: any) => {
    const newRequest: Request = {
      id: String(requests.length + 1),
      title: data.title,
      description: data.description,
      location: data.location,
      category: data.type,
      subType: data.subType.toLowerCase().replace(" ", "_") as any,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: "Just now",
      attachments: data.attachments?.map((file: File, idx: number) => ({
        id: `new_${idx}`,
        url: URL.createObjectURL(file),
        name: file.name,
        type: file.type.startsWith("image") ? "image" : "video",
      })) || [],
      comments: [],
      timeline: [
        { id: "t1", date: new Date().toLocaleDateString(), title: "Request Submitted", description: "Your request has been received", status: "pending" },
      ],
    };
    setRequests([newRequest, ...requests]);
  };

  const handleAddComment = (requestId: string, comment: string, attachments?: File[]) => {
    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        const newComment: Comment = {
          id: `c${Date.now()}`,
          author: "student",
          authorName: "You",
          content: comment,
          createdAt: new Date().toLocaleString(),
          attachments: attachments?.map((file, idx) => ({
            id: `att_${Date.now()}_${idx}`,
            url: URL.createObjectURL(file),
            name: file.name,
            type: file.type.startsWith("image") ? "image" : "video",
          })),
        };
        return { ...req, comments: [...req.comments, newComment], updatedAt: "Just now" };
      }
      return req;
    }));
  };

  return (
    <div className="space-y-6 pb-24 lg:pb-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-stone-500">
            Student Services
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[#28231f] sm:text-5xl">
            My Requests
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">
            Track your maintenance tickets, complaints, and transfer requests
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-[#2f2a24] px-5 text-sm font-medium text-white transition hover:bg-[#40382f] active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          New Request
        </button>
      </div>

      {/* Content */}
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Filters Sidebar */}
        <aside className="space-y-6">
          <RequestFilters
            activeTab={activeTab}
            onTabChange={setActiveTab}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </aside>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-stone-200 bg-white p-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-stone-100">
                <svg className="h-8 w-8 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-stone-900">{emptyMessages[activeTab].title}</h3>
              <p className="mt-2 text-stone-500">{emptyMessages[activeTab].description}</p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onClick={() => setSelectedRequest(request)}
              />
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateRequestModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateRequest}
      />

      <RequestDetailModal
        request={selectedRequest}
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onAddComment={handleAddComment}
      />
    </div>
  );
}
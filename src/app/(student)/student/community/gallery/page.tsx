// app/(student)/community/gallery/page.tsx
"use client";

import { useState, useCallback } from "react";
import { Heart, Calendar, Users, X, ChevronLeft, ChevronRight, Filter, ThumbsUp } from "lucide-react";
import { CommunityTabs } from "../_components/community-tabs";
import type { GalleryImage } from "../_components/types";

const mockGallery: GalleryImage[] = [
  {
    id: "1",
    imageUrl: "https://picsum.photos/seed/gallery1/600/500",
    title: "Championship Celebration",
    event: "Football Tournament 2025",
    date: "Aug 25, 2024",
    likes: 45,
    photographer: "Sports Club",
  },
  {
    id: "2",
    imageUrl: "https://picsum.photos/seed/gallery2/600/500",
    title: "Movie Night Setup",
    event: "Movie Night",
    date: "Aug 28, 2024",
    likes: 32,
    photographer: "Residence Office",
  },
  {
    id: "3",
    imageUrl: "https://picsum.photos/seed/gallery3/600/500",
    title: "Volunteer Team",
    event: "Volunteer Day",
    date: "Sep 02, 2024",
    likes: 67,
    photographer: "Volunteer Club",
  },
  {
    id: "4",
    imageUrl: "https://picsum.photos/seed/gallery4/600/500",
    title: "Dorm Festival Main Stage",
    event: "Dorm Festival 2025",
    date: "Sep 10, 2024",
    likes: 89,
    photographer: "Student Council",
  },
  {
    id: "5",
    imageUrl: "https://picsum.photos/seed/gallery5/600/500",
    title: "Study Workshop",
    event: "Study Workshop",
    date: "Sep 05, 2024",
    likes: 23,
    photographer: "Academic Support",
  },
  {
    id: "6",
    imageUrl: "https://picsum.photos/seed/gallery6/600/500",
    title: "Board Game Night",
    event: "Board Game Night",
    date: "Sep 02, 2024",
    likes: 41,
    photographer: "Board Game Club",
  },
  {
    id: "7",
    imageUrl: "https://picsum.photos/seed/gallery7/600/500",
    title: "Welcome Party",
    event: "New Semester Welcome",
    date: "Sep 15, 2024",
    likes: 78,
    photographer: "Residence Office",
  },
  {
    id: "8",
    imageUrl: "https://picsum.photos/seed/gallery8/600/500",
    title: "Talent Show",
    event: "Dorm Talent Show",
    date: "Sep 20, 2024",
    likes: 56,
    photographer: "Student Council",
  },
];

// Lấy danh sách các event duy nhất để lọc
const getUniqueEvents = (images: GalleryImage[]) => {
  const events = new Set(images.map(img => img.event));
  return Array.from(events);
};

// Modal xem ảnh fullscreen
function ImageModal({ 
  image, 
  onClose, 
  onNext, 
  onPrev,
  onLike,
}: { 
  image: GalleryImage | null; 
  onClose: () => void; 
  onNext: () => void;
  onPrev: () => void;
  onLike: (imageId: string) => void;
}) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(image?.likes || 0);

  if (!image) return null;

  const handleLike = () => {
    if (!liked) {
      setLiked(true);
      setLikesCount(prev => prev + 1);
      onLike(image.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={onClose}>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
      >
        <X className="h-6 w-6" />
      </button>
      
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed"
        disabled={!onPrev}
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed"
        disabled={!onNext}
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
        <img
          src={image.imageUrl}
          alt={image.title}
          className="max-h-[70vh] w-auto rounded-lg object-contain"
        />
        <div className="mt-4 text-center text-white">
          <h3 className="text-xl font-semibold">{image.title}</h3>
          <p className="mt-1 text-sm text-white/70">{image.event} • {image.date}</p>
          <p className="mt-1 text-sm text-white/50">📸 {image.photographer}</p>
          <button
            onClick={handleLike}
            className={`mt-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
              liked 
                ? "bg-red-500 text-white" 
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-white" : ""}`} />
            {likesCount} likes
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const [gallery, setGallery] = useState(mockGallery);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [likedImages, setLikedImages] = useState<Set<string>>(new Set());

  // Lấy danh sách các event để hiển thị filter
  const events = getUniqueEvents(gallery);
  const filterOptions = ["all", ...events];

  // Lọc ảnh theo event
  const filteredGallery = activeFilter === "all" 
    ? gallery 
    : gallery.filter(img => img.event === activeFilter);

  // Xử lý khi click vào ảnh
  const handleImageClick = (image: GalleryImage, index: number) => {
    setSelectedImage(image);
    setSelectedIndex(index);
  };

  // Xử lý next ảnh trong modal
  const handleNext = () => {
    const currentFilteredIndex = filteredGallery.findIndex(img => img.id === selectedImage?.id);
    if (currentFilteredIndex < filteredGallery.length - 1) {
      setSelectedImage(filteredGallery[currentFilteredIndex + 1]);
      setSelectedIndex(currentFilteredIndex + 1);
    }
  };

  // Xử lý prev ảnh trong modal
  const handlePrev = () => {
    const currentFilteredIndex = filteredGallery.findIndex(img => img.id === selectedImage?.id);
    if (currentFilteredIndex > 0) {
      setSelectedImage(filteredGallery[currentFilteredIndex - 1]);
      setSelectedIndex(currentFilteredIndex - 1);
    }
  };

  // Xử lý like ảnh
  const handleLike = (imageId: string) => {
    if (likedImages.has(imageId)) return;
    
    setLikedImages(prev => new Set(prev).add(imageId));
    setGallery(prev =>
      prev.map(img =>
        img.id === imageId ? { ...img, likes: img.likes + 1 } : img
      )
    );
  };

  // Xử lý reset filter
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  return (
    <div className="space-y-6 pb-24 lg:pb-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-stone-500">
            Community
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[#28231f] sm:text-5xl">
            Gallery
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">
            Memories from dormitory events and activities
          </p>
        </div>
        <CommunityTabs />
      </div>

      {/* Filter by event - có thể bấm */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="h-4 w-4 text-stone-400" />
        <span className="text-sm text-stone-500 mr-1">Filter:</span>
        {filterOptions.map((filter) => (
          <button
            key={filter}
            onClick={() => handleFilterChange(filter)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all active:scale-[0.95] ${
              activeFilter === filter
                ? "bg-[#2f2a24] text-white shadow-md"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            {filter === "all" ? "All Photos" : filter}
          </button>
        ))}
      </div>

      {/* Kết quả lọc */}
      <p className="text-sm text-stone-500">
        Showing {filteredGallery.length} photo{filteredGallery.length !== 1 ? 's' : ''}
        {activeFilter !== "all" && ` from "${activeFilter}"`}
      </p>

      {/* Gallery Grid - 4 columns on desktop */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {filteredGallery.map((image, idx) => {
          const isLiked = likedImages.has(image.id);
          
          return (
            <div
              key={image.id}
              onClick={() => handleImageClick(image, idx)}
              className="group relative cursor-pointer overflow-hidden rounded-xl bg-white shadow-md transition-all duration-200 hover:shadow-xl active:scale-[0.98]"
            >
              {/* Image */}
              <div className="aspect-square overflow-hidden">
                <img
                  src={image.imageUrl}
                  alt={image.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Overlay - appears on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition duration-300 group-hover:opacity-100">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-sm font-semibold text-white line-clamp-1">
                    {image.title}
                  </h3>
                  <div className="mt-1 flex items-center justify-between text-xs text-white/80">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {image.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {image.event}
                    </span>
                  </div>
                </div>
              </div>

              {/* Event badge */}
              <div className="absolute top-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">
                {image.event}
              </div>

              {/* Like button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(image.id);
                }}
                className={`absolute bottom-2 right-2 flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium transition-all active:scale-[0.95] ${
                  isLiked
                    ? "bg-red-500 text-white"
                    : "bg-black/50 text-white hover:bg-black/70"
                }`}
              >
                <Heart className={`h-3 w-3 ${isLiked ? "fill-white" : ""}`} />
                {image.likes}
              </button>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredGallery.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-stone-200 bg-white p-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-stone-100">
            <svg className="h-8 w-8 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-stone-900">No photos found</h3>
          <p className="mt-2 text-stone-500">
            {activeFilter !== "all" 
              ? `No photos available for "${activeFilter}". Try another filter.`
              : "Photos from events will appear here."}
          </p>
          {activeFilter !== "all" && (
            <button
              onClick={() => handleFilterChange("all")}
              className="mt-4 rounded-full bg-[#2f2a24] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#40382f] active:scale-[0.98]"
            >
              View all photos
            </button>
          )}
        </div>
      )}

      {/* Image Modal */}
      <ImageModal
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
        onNext={handleNext}
        onPrev={handlePrev}
        onLike={handleLike}
      />
    </div>
  );
}
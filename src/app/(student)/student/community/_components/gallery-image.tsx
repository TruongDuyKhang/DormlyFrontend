// app/(student)/community/_components/gallery-image.tsx
"use client";

import { Heart, Calendar } from "lucide-react";
import { useState } from "react";
import type { GalleryImage } from "./types";

interface GalleryImageProps {
  image: GalleryImage;
  onClick?: () => void;
}

export function GalleryImage({ image, onClick }: GalleryImageProps) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(image.likes);

  return (
    <div
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-xl bg-white shadow-md transition-all duration-200 hover:shadow-xl"
    >
      {/* Image */}
      <div className="aspect-square overflow-hidden">
        <img
          src={image.imageUrl}
          alt={image.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

      {/* Info */}
      <div className="absolute bottom-0 left-0 right-0 p-3 text-white translate-y-full transition duration-300 group-hover:translate-y-0">
        <h3 className="text-sm font-semibold">{image.title}</h3>
        <div className="mt-1 flex items-center gap-3 text-xs text-white/80">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {image.date}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLiked(!liked);
              setLikesCount(prev => liked ? prev - 1 : prev + 1);
            }}
            className="flex items-center gap-1 transition hover:text-red-400"
          >
            <Heart className={`h-3 w-3 ${liked ? "fill-red-500 text-red-500" : ""}`} />
            {likesCount}
          </button>
        </div>
      </div>

      {/* Event badge */}
      <div className="absolute top-2 left-2 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white">
        {image.event}
      </div>
    </div>
  );
}
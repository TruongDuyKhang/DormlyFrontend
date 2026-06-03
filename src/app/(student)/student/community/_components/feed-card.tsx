// app/(student)/community/_components/feed-card.tsx
"use client";

import { Heart, MessageCircle, Share2, Building2, GraduationCap, Users } from "lucide-react";
import { useState } from "react";
import type { FeedPost } from "./types";

interface FeedCardProps {
  post: FeedPost;
}

const typeConfig = {
  news: { 
    label: "Dormitory News", 
    icon: Building2, 
    color: "bg-sky-600 text-white"  // Đậm màu như assigned
  },
  school: { 
    label: "School News", 
    icon: GraduationCap, 
    color: "bg-emerald-600 text-white"  // Đậm màu như resolved
  },
  community: { 
    label: "Community", 
    icon: Users, 
    color: "bg-amber-600 text-white"  // Đậm màu như pending
  },
};

export function FeedCard({ post }: FeedCardProps) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const type = typeConfig[post.type];
  const Icon = type.icon;

  return (
    <article className="rounded-xl border border-stone-200/70 bg-white p-4 transition-all duration-200 hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {/* Tag đậm màu như status badge */}
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${type.color}`}>
            <Icon className="h-3 w-3" />
            {type.label}
          </span>
          <span className="text-xs text-stone-400">{post.date}</span>
        </div>
        <span className="text-xs font-medium text-stone-500">{post.author}</span>
      </div>

      {/* Image */}
      {post.imageUrl && (
        <div className="mt-3 overflow-hidden rounded-lg">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="h-48 w-full object-cover transition duration-300 hover:scale-105"
          />
        </div>
      )}

      {/* Content */}
      <div className="mt-3">
        <h3 className="font-semibold text-stone-900">{post.title}</h3>
        <p className="mt-1 text-sm text-stone-600 line-clamp-3">{post.description}</p>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-4 border-t border-stone-100 pt-3">
        <button
          onClick={() => {
            setLiked(!liked);
            setLikesCount(prev => liked ? prev - 1 : prev + 1);
          }}
          className={`flex items-center gap-1.5 text-sm transition ${
            liked ? "text-red-500" : "text-stone-500 hover:text-red-500"
          }`}
        >
          <Heart className={`h-4 w-4 ${liked ? "fill-red-500" : ""}`} />
          {likesCount}
        </button>
        <button className="flex items-center gap-1.5 text-sm text-stone-500 transition hover:text-stone-700">
          <MessageCircle className="h-4 w-4" />
          {post.comments}
        </button>
        <button className="flex items-center gap-1.5 text-sm text-stone-500 transition hover:text-stone-700">
          <Share2 className="h-4 w-4" />
          Share
        </button>
      </div>
    </article>
  );
}
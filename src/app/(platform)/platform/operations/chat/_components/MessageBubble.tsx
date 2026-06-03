// app/(platform)/operations/chat/_components/MessageBubble.tsx
'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Message } from './types';
import { Check, CheckCheck, File, Image } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar: boolean;
}

export function MessageBubble({ message, isOwn, showAvatar }: MessageBubbleProps) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };
  
  const renderContent = () => {
    if (message.type === 'image' && message.fileUrl) {
      return (
        <img
          src={message.fileUrl}
          alt="Shared image"
          className="max-w-xs rounded-lg cursor-pointer hover:opacity-90 transition"
        />
      );
    }
    
    if (message.type === 'file' && message.fileUrl) {
      return (
        <a
          href={message.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg bg-white/40 px-3 py-2 text-sm text-stone-700 hover:bg-white/60 transition"
        >
          <File className="h-4 w-4" />
          <span>{message.fileName || 'Download file'}</span>
        </a>
      );
    }
    
    return (
      <p className="whitespace-pre-wrap break-words text-sm">
        {message.content}
      </p>
    );
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex items-end gap-2", isOwn && "flex-row-reverse")}
    >
      {/* Avatar */}
      {showAvatar && (
        <div className={cn(
          "h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold",
          isOwn ? "bg-[#c3a26c] text-white" : "bg-stone-300 text-stone-700"
        )}>
          {isOwn ? 'You' : message.senderName.charAt(0)}
        </div>
      )}
      {!showAvatar && <div className="w-8 shrink-0" />}
      
      {/* Message Bubble */}
      <div className={cn(
        "max-w-[70%] rounded-2xl px-4 py-2 shadow-sm",
        isOwn 
          ? "bg-[#c3a26c] text-white rounded-tr-sm" 
          : "bg-white/60 text-stone-800 rounded-tl-sm"
      )}>
        {!isOwn && showAvatar && (
          <p className="mb-1 text-xs font-medium text-[#c3a26c]">
            {message.senderName}
          </p>
        )}
        
        {renderContent()}
        
        <div className={cn("mt-1 flex items-center justify-end gap-1", isOwn ? "text-white/70" : "text-stone-400")}>
          <span className="text-[10px]">{formatTime(message.timestamp)}</span>
          {isOwn && (
            message.isRead ? (
              <CheckCheck className="h-3 w-3" />
            ) : (
              <Check className="h-3 w-3" />
            )
          )}
        </div>
      </div>
    </motion.div>
  );
}
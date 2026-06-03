// app/(platform)/operations/chat/_components/MessageInput.tsx
'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Paperclip, Image as ImageIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  onSend: (content: string, type: 'text' | 'image' | 'file', fileUrl?: string, fileName?: string) => void;
}

export function MessageInput({ onSend }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim(), 'text');
      setMessage('');
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock file upload - in real app, upload to server
      const fileUrl = URL.createObjectURL(file);
      onSend('', type, fileUrl, file.name);
    }
    e.target.value = '';
  };
  
  return (
    <div className="border-t border-white/40 bg-white/20 p-4">
      <div className="flex items-end gap-2">
        {/* Attachments */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-full p-2 text-stone-500 hover:bg-white/40 transition"
          >
            <Paperclip className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            className="rounded-full p-2 text-stone-500 hover:bg-white/40 transition"
          >
            <ImageIcon className="h-5 w-5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => handleFileUpload(e, 'file')}
          />
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileUpload(e, 'image')}
          />
        </div>
        
        {/* Text Input */}
        <div className="flex-1 rounded-2xl border border-white/55 bg-white/40 px-4 py-2">
          <textarea
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setIsTyping(e.target.value.length > 0);
            }}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            rows={1}
            className="w-full resize-none bg-transparent text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none"
            style={{ minHeight: '40px', maxHeight: '120px' }}
          />
        </div>
        
        {/* Send Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSend}
          disabled={!message.trim()}
          className={cn(
            "rounded-full p-2 transition",
            message.trim() 
              ? "bg-[#c3a26c] text-white hover:bg-[#b08f5a]" 
              : "bg-stone-200 text-stone-400 cursor-not-allowed"
          )}
        >
          <Send className="h-5 w-5" />
        </motion.button>
      </div>
      
      {/* Typing indicator */}
      {isTyping && (
        <div className="mt-1 px-2">
          <div className="flex gap-1">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-400" style={{ animationDelay: '0ms' }} />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-400" style={{ animationDelay: '150ms' }} />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-400" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}
    </div>
  );
}
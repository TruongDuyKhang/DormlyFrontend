// app/(platform)/operations/chat/_components/SearchInChatModal.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, MessageCircle, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Message } from './types';

interface SearchInChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  onSearchResult: (messageId: string) => void;
}

export function SearchInChatModal({ isOpen, onClose, messages, onSearchResult }: SearchInChatModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentResultIndex, setCurrentResultIndex] = useState(0);
  
  const searchResults = messages.filter(msg =>
    msg.type === 'text' && msg.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentResultIndex(0);
  };
  
  const handleNext = () => {
    if (searchResults.length > 0) {
      const newIndex = (currentResultIndex + 1) % searchResults.length;
      setCurrentResultIndex(newIndex);
      onSearchResult(searchResults[newIndex].id);
    }
  };
  
  const handlePrevious = () => {
    if (searchResults.length > 0) {
      const newIndex = (currentResultIndex - 1 + searchResults.length) % searchResults.length;
      setCurrentResultIndex(newIndex);
      onSearchResult(searchResults[newIndex].id);
    }
  };
  
  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <mark key={i} className="bg-[#c3a26c]/30 text-stone-950 rounded px-0.5">{part}</mark>
        : part
    );
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="relative w-[500px] h-[550px] rounded-2xl border border-white/60 bg-[#f3eee6] shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header - fixed */}
            <div className="bg-gradient-to-r from-[#c3a26c]/20 to-[#c3a26c]/5 px-5 py-4 border-b border-white/40 shrink-0">
              <button onClick={onClose} className="absolute right-3 top-3 rounded-full p-1.5 text-stone-500 hover:bg-white/50">
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-[#c3a26c]" />
                <h2 className="text-lg font-semibold tracking-tight text-stone-950">Search in conversation</h2>
              </div>
            </div>
            
            {/* Content - fixed height scrollable */}
            <div className="flex-1 overflow-hidden flex flex-col p-5 space-y-4">
              {/* Search Input */}
              <div className="relative shrink-0">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search for messages..."
                  className="w-full rounded-xl border border-white/55 bg-white/40 py-2.5 pl-9 pr-4 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30"
                  autoFocus
                />
              </div>
              
              {/* Results */}
              {searchQuery && (
                <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                  <div className="flex items-center justify-between mb-3 shrink-0">
                    <p className="text-sm text-stone-500">
                      {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                    </p>
                    {searchResults.length > 0 && (
                      <div className="flex gap-2">
                        <button
                          onClick={handlePrevious}
                          className="rounded-full p-1.5 text-stone-500 hover:bg-white/40 transition"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={handleNext}
                          className="rounded-full p-1.5 text-stone-500 hover:bg-white/40 transition"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 overflow-y-auto space-y-2">
                    {searchResults.map((msg, idx) => (
                      <button
                        key={msg.id}
                        onClick={() => {
                          onSearchResult(msg.id);
                          setCurrentResultIndex(idx);
                        }}
                        className={cn(
                          "w-full text-left p-3 rounded-xl transition",
                          idx === currentResultIndex
                            ? "bg-[#c3a26c]/15 border border-[#c3a26c]/30"
                            : "hover:bg-white/40"
                        )}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-[#c3a26c]">{msg.senderName}</span>
                          <span className="text-xs text-stone-400">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm text-stone-700">
                          {highlightText(msg.content, searchQuery)}
                        </p>
                      </button>
                    ))}
                    
                    {searchResults.length === 0 && (
                      <div className="text-center py-8">
                        <MessageCircle className="h-10 w-10 text-stone-300 mx-auto mb-3" />
                        <p className="text-stone-500">No messages found</p>
                        <p className="text-xs text-stone-400 mt-1">Try a different search term</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {!searchQuery && (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <Search className="h-12 w-12 text-stone-300 mb-3" />
                  <p className="text-stone-500">Enter a keyword to search in this conversation</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
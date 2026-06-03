// app/(platform)/operations/chat/_components/ChatHeader.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Menu, Users, Pin, MoreVertical, Phone, Video, Edit2, Archive, Trash2, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Conversation } from './types';

interface ChatHeaderProps {
  conversation: Conversation;
  onMenuToggle: () => void;
  onRename: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onSearchInChat: () => void;
}

export function ChatHeader({ conversation, onMenuToggle, onRename, onArchive, onDelete, onSearchInChat }: ChatHeaderProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const getStatusText = () => {
    if (conversation.type === 'group') {
      return `${conversation.participants.length} members`;
    }
    const participant = conversation.participants.find(p => p.id !== 'manager-1');
    if (participant?.status === 'online') return 'Online';
    if (participant?.status === 'away') return 'Away';
    if (participant?.lastSeen) {
      const date = new Date(participant.lastSeen);
      return `Last seen ${date.toLocaleTimeString()}`;
    }
    return 'Offline';
  };
  
  const menuOptions = [
    { icon: Search, label: 'Search in conversation', action: onSearchInChat, color: 'text-stone-600' },
    { icon: Edit2, label: 'Rename', action: onRename, color: 'text-stone-600' },
    { icon: Archive, label: 'Archive', action: onArchive, color: 'text-stone-600' },
    { icon: Trash2, label: 'Delete conversation', action: onDelete, color: 'text-red-500' },
  ];
  
  return (
    <div className="border-b border-white/40 bg-white/20 px-6 pt-6 pb-4 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="rounded-full p-2 text-stone-500 hover:bg-white/40 transition lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#c3a26c]/20 text-[#c3a26c]">
          {conversation.type === 'group' ? (
            <Users className="h-6 w-6" />
          ) : (
            <span className="text-base font-semibold">
              {conversation.name.charAt(0)}
            </span>
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-stone-950">{conversation.name}</h3>
          <p className="text-sm text-stone-500 mt-0.5">{getStatusText()}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        <button className="rounded-full p-2.5 text-stone-500 hover:bg-white/40 transition">
          <Phone className="h-5 w-5" />
        </button>
        <button className="rounded-full p-2.5 text-stone-500 hover:bg-white/40 transition">
          <Video className="h-5 w-5" />
        </button>
        {conversation.isPinned && (
          <Pin className="h-5 w-5 text-stone-400" />
        )}
        
        {/* Menu 3 dots */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="rounded-full p-2.5 text-stone-500 hover:bg-white/40 transition"
          >
            <MoreVertical className="h-5 w-5" />
          </button>
          
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 top-full mt-2 z-30 w-56 rounded-xl border border-white/60 bg-[#f3eee6] shadow-xl overflow-hidden"
              >
                {menuOptions.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      option.action();
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition hover:bg-white/40"
                  >
                    <option.icon className={cn("h-4 w-4", option.color)} />
                    <span className={option.color === 'text-red-500' ? 'text-red-500' : 'text-stone-700'}>
                      {option.label}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
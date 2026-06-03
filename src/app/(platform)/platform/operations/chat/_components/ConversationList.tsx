// app/(platform)/operations/chat/_components/ConversationList.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Pin, Users, MessageCircle, Edit2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Conversation, User } from './types';

interface ConversationListProps {
  conversations: Conversation[];
  selectedId?: string;
  onSelect: (conversation: Conversation) => void;
  currentUser: User;
  onNewChat: () => void;
  onCreateGroup: () => void;
}

export function ConversationList({ conversations, selectedId, onSelect, currentUser, onNewChat, onCreateGroup }: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const pinnedConversations = filteredConversations.filter(conv => conv.isPinned);
  const otherConversations = filteredConversations.filter(conv => !conv.isPinned);
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 3600000) {
      return `${Math.floor(diff / 60000)}m`;
    } else if (diff < 86400000) {
      return `${Math.floor(diff / 3600000)}h`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };
  
  return (
    <>
      <style>{`
        .conversation-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .conversation-scroll::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.08);
          border-radius: 3px;
        }
        .conversation-scroll::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.4);
          border-radius: 3px;
          transition: background 0.2s;
        }
        .conversation-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.6);
        }
        .conversation-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 0, 0, 0.4) rgba(0, 0, 0, 0.08);
        }
      `}</style>
      
      <div className="flex flex-col h-full overflow-hidden">
        <div className="border-b border-white/40 shrink-0">
          <div className="px-4 pt-6 pb-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-stone-950">Messages</h2>
              <div className="flex gap-1">
                <button
                  onClick={onNewChat}
                  className="rounded-full p-2 text-stone-500 hover:bg-white/40 transition"
                  title="New message"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button
                  onClick={onCreateGroup}
                  className="rounded-full p-2 text-stone-500 hover:bg-white/40 transition"
                  title="New group"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full rounded-xl border border-white/55 bg-white/40 py-2.5 pl-9 pr-4 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30"
              />
            </div>
          </div>
        </div>
        
        <div className="conversation-scroll flex-1 overflow-y-auto">
          {pinnedConversations.length > 0 && (
            <div className="px-2 py-2">
              <p className="px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-stone-500">Pinned</p>
              {pinnedConversations.map((conv, idx) => (
                <ConversationItem
                  key={conv.id}
                  conversation={conv}
                  isSelected={selectedId === conv.id}
                  onSelect={onSelect}
                  formatTime={formatTime}
                  index={idx}
                />
              ))}
            </div>
          )}
          
          <div className="px-2 py-2">
            {pinnedConversations.length > 0 && otherConversations.length > 0 && (
              <p className="px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-stone-500">All Messages</p>
            )}
            {otherConversations.map((conv, idx) => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                isSelected={selectedId === conv.id}
                onSelect={onSelect}
                formatTime={formatTime}
                index={idx}
              />
            ))}
          </div>
          
          {filteredConversations.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MessageCircle className="h-10 w-10 text-stone-300 mb-3" />
              <p className="text-sm text-stone-500">No conversations found</p>
              <button
                onClick={onNewChat}
                className="mt-3 rounded-lg bg-[#c3a26c] px-4 py-2 text-sm text-white hover:bg-[#b08f5a] transition"
              >
                Start new chat
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onSelect: (conversation: Conversation) => void;
  formatTime: (timestamp: string) => string;
  index: number;
}

function ConversationItem({ conversation, isSelected, onSelect, formatTime, index }: ConversationItemProps) {
  const getStatusColor = () => {
    if (conversation.type === 'group') return 'bg-purple-500';
    const participant = conversation.participants.find(p => p.id !== 'manager-1');
    if (participant?.status === 'online') return 'bg-emerald-500';
    if (participant?.status === 'away') return 'bg-amber-500';
    return 'bg-stone-400';
  };
  
  const getStatusText = () => {
    if (conversation.type === 'group') return `${conversation.participants.length} members`;
    const participant = conversation.participants.find(p => p.id !== 'manager-1');
    if (participant?.status === 'online') return 'Online';
    if (participant?.status === 'away') return 'Away';
    return 'Offline';
  };
  
  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      onClick={() => onSelect(conversation)}
      className={cn(
        "w-full rounded-xl p-3 text-left transition-all duration-200 mb-1",
        isSelected 
          ? "bg-[#c3a26c]/15 border border-[#c3a26c]/30" 
          : "hover:bg-white/30"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          {conversation.avatar ? (
            <img src={conversation.avatar} alt="" className="h-12 w-12 rounded-xl object-cover" />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#c3a26c]/20 text-[#c3a26c]">
              {conversation.type === 'group' ? (
                <Users className="h-5 w-5" />
              ) : (
                <span className="text-sm font-semibold">{conversation.name.charAt(0)}</span>
              )}
            </div>
          )}
          <div className={cn(
            "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-white",
            getStatusColor()
          )} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-medium text-stone-950 truncate">{conversation.name}</p>
            <span className="text-xs text-stone-400 shrink-0">{formatTime(conversation.updatedAt)}</span>
          </div>
          <p className="mt-0.5 text-xs text-stone-500">{getStatusText()}</p>
          <p className="mt-1 text-sm text-stone-500 truncate">
            {conversation.lastMessage.senderId === 'manager-1' ? 'You: ' : ''}
            {conversation.lastMessage.content}
          </p>
        </div>
        
        {conversation.unreadCount > 0 && (
          <div className="shrink-0 rounded-full bg-[#c3a26c] px-1.5 py-0.5 text-xs font-semibold text-white">
            {conversation.unreadCount}
          </div>
        )}
      </div>
    </motion.button>
  );
}
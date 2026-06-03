// app/(platform)/operations/chat/_components/SearchUsersModal.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, UserPlus, MessageCircle, Shield, GraduationCap, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Conversation, User } from './types';
import { allUsers } from './mockData';

interface SearchUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUser: (user: User) => void;
  currentUser: User;
  existingConversations: Conversation[];
}

export function SearchUsersModal({ isOpen, onClose, onSelectUser, currentUser, existingConversations }: SearchUsersModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  
  const getRoleIcon = (role: string) => {
    switch(role) {
      case 'student': return <GraduationCap className="h-4 w-4" />;
      case 'manager': return <Shield className="h-4 w-4" />;
      case 'admin': return <Shield className="h-4 w-4" />;
      default: return <UserPlus className="h-4 w-4" />;
    }
  };
  
  const getRoleColor = (role: string) => {
    switch(role) {
      case 'student': return 'bg-blue-100 text-blue-700';
      case 'manager': return 'bg-emerald-100 text-emerald-700';
      case 'admin': return 'bg-purple-100 text-purple-700';
      default: return 'bg-stone-100 text-stone-700';
    }
  };
  
  const filteredUsers = allUsers
    .filter(user => user.id !== currentUser.id)
    .filter(user => 
      (selectedRole === 'all' || user.role === selectedRole) &&
      (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       (user.studentId && user.studentId.toLowerCase().includes(searchQuery.toLowerCase())) ||
       (user.department && user.department.toLowerCase().includes(searchQuery.toLowerCase())))
    );
  
  const getExistingConversation = (userId: string) => {
    return existingConversations.find(
      conv => conv.type === 'direct' && conv.participants.some(p => p.id === userId)
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
            className="relative w-[500px] h-[600px] rounded-2xl border border-white/60 bg-[#f3eee6] shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header - fixed */}
            <div className="bg-gradient-to-r from-[#c3a26c]/20 to-[#c3a26c]/5 px-5 py-4 border-b border-white/40 shrink-0">
              <button onClick={onClose} className="absolute right-3 top-3 rounded-full p-1.5 text-stone-500 hover:bg-white/50">
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-[#c3a26c]" />
                <h2 className="text-lg font-semibold tracking-tight text-stone-950">New Message</h2>
              </div>
              <p className="text-sm text-stone-500 mt-1">Find someone to start a conversation</p>
            </div>
            
            {/* Content - scrollable */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, student ID, or department..."
                  className="w-full rounded-xl border border-white/55 bg-white/40 py-2.5 pl-9 pr-4 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30"
                  autoFocus
                />
              </div>
              
              {/* Role Filters */}
              <div className="flex gap-2">
                {['all', 'student', 'manager', 'admin'].map((role) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium transition capitalize",
                      selectedRole === role
                        ? "bg-[#c3a26c] text-white"
                        : "bg-white/40 text-stone-600 hover:bg-white/60"
                    )}
                  >
                    {role === 'all' ? 'All' : role}
                  </button>
                ))}
              </div>
              
              {/* Users List */}
              <div className="space-y-2">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => {
                    const existingConv = getExistingConversation(user.id);
                    const status = ['online', 'offline', 'away'][Math.floor(Math.random() * 3)] as 'online' | 'offline' | 'away';
                    
                    return (
                      <button
                        key={user.id}
                        onClick={() => onSelectUser(user)}
                        className="w-full flex items-center gap-3 rounded-xl p-3 text-left transition hover:bg-white/40 group"
                      >
                        <div className="relative shrink-0">
                          {user.avatar ? (
                            <img src={user.avatar} alt="" className="h-12 w-12 rounded-xl object-cover" />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#c3a26c]/20 text-[#c3a26c]">
                              <span className="text-base font-semibold">{user.name.charAt(0)}</span>
                            </div>
                          )}
                          <div className={cn(
                            "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-1 ring-white",
                            status === 'online' ? "bg-emerald-500" : status === 'away' ? "bg-amber-500" : "bg-stone-400"
                          )} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-stone-950 truncate">{user.name}</p>
                            <span className={cn("text-xs px-1.5 py-0.5 rounded-full shrink-0", getRoleColor(user.role))}>
                              {user.role}
                            </span>
                          </div>
                          {user.studentId && (
                            <p className="text-xs text-stone-500">ID: {user.studentId}</p>
                          )}
                          {user.department && (
                            <p className="text-xs text-stone-500 truncate">{user.department}</p>
                          )}
                        </div>
                        
                        <div className="shrink-0">
                          {existingConv ? (
                            <span className="text-xs text-stone-400 flex items-center gap-1">
                              <MessageCircle className="h-3 w-3" />
                              Existing
                            </span>
                          ) : (
                            <div className="rounded-full bg-[#c3a26c]/20 p-2 opacity-0 group-hover:opacity-100 transition">
                              <MessageCircle className="h-4 w-4 text-[#c3a26c]" />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-10 w-10 text-stone-300 mx-auto mb-3" />
                    <p className="text-stone-500">No users found</p>
                    <p className="text-xs text-stone-400 mt-1">Try a different search term</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
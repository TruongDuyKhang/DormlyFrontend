// app/(student)/chat/_components/create-group-modal.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Search, Check, Image, Upload, ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { User } from './types';
import { allUsers, currentUser } from './mock-data';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onGroupCreated: (group: any) => void;
}

export function CreateGroupModal({ isOpen, onClose, currentUser, onGroupCreated }: CreateGroupModalProps) {
  const [step, setStep] = useState<'info' | 'members'>('info');
  const [groupName, setGroupName] = useState('');
  const [groupAvatar, setGroupAvatar] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  
  const availableMembers = allUsers.filter(u => u.id !== currentUser.id);
  const filteredMembers = availableMembers.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.studentId && m.studentId.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const handleCreate = () => {
    if (groupName.trim() && selectedMembers.length > 0) {
      onGroupCreated({
        name: groupName,
        avatar: groupAvatar,
        members: selectedMembers,
      });
      onClose();
      resetForm();
    }
  };
  
  const resetForm = () => {
    setStep('info');
    setGroupName('');
    setGroupAvatar(null);
    setSearchQuery('');
    setSelectedMembers([]);
  };
  
  const toggleMember = (memberId: string) => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setGroupAvatar(url);
    }
  };
  
  const canProceed = step === 'info' ? groupName.trim() !== '' : selectedMembers.length > 0;
  
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
            <div className="bg-gradient-to-r from-[#9d7443]/20 to-[#9d7443]/5 px-5 py-4 border-b border-white/40 shrink-0">
              <button onClick={onClose} className="absolute right-3 top-3 rounded-full p-1.5 text-stone-500 hover:bg-white/50">
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#9d7443]" />
                <h2 className="text-lg font-semibold tracking-tight text-stone-950">Create Group Chat</h2>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => setStep('info')}
                  className={cn(
                    "text-xs font-medium transition",
                    step === 'info' ? "text-[#9d7443]" : "text-stone-400"
                  )}
                >
                  1. Group Info
                </button>
                <ChevronRight className="h-3 w-3 text-stone-400" />
                <button
                  onClick={() => setStep('members')}
                  className={cn(
                    "text-xs font-medium transition",
                    step === 'members' ? "text-[#9d7443]" : "text-stone-400"
                  )}
                >
                  2. Add Members
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5">
              {step === 'info' ? (
                <div className="space-y-5">
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-[#9d7443]/20 text-[#9d7443] overflow-hidden">
                        {groupAvatar ? (
                          <img src={groupAvatar} alt="Group avatar" className="h-full w-full object-cover" />
                        ) : (
                          <Users className="h-10 w-10" />
                        )}
                      </div>
                      <label className="absolute -bottom-1 -right-1 rounded-full bg-white p-1.5 cursor-pointer shadow-md">
                        <Upload className="h-3 w-3 text-stone-600" />
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-stone-950 mb-1 block">Group Name</label>
                    <input
                      type="text"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      placeholder="e.g., North House Residents"
                      className="w-full rounded-xl border border-white/55 bg-white/40 px-4 py-2.5 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#9d7443]/30"
                      autoFocus
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-stone-950 mb-1 block">Description (Optional)</label>
                    <textarea
                      rows={3}
                      placeholder="What is this group about?"
                      className="w-full rounded-xl border border-white/55 bg-white/40 px-4 py-2.5 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#9d7443]/30 resize-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search members..."
                      className="w-full rounded-xl border border-white/55 bg-white/40 py-2.5 pl-9 pr-4 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#9d7443]/30"
                      autoFocus
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-stone-500">{selectedMembers.length} member(s) selected</p>
                  </div>
                  
                  <div className="space-y-1 max-h-[340px] overflow-y-auto">
                    {filteredMembers.map((member) => {
                      const status = member.status || 'offline';
                      const isSelected = selectedMembers.includes(member.id);
                      return (
                        <button
                          key={member.id}
                          onClick={() => toggleMember(member.id)}
                          className={cn(
                            "w-full flex items-center gap-3 rounded-xl p-2.5 text-left transition",
                            isSelected ? "bg-[#9d7443]/10" : "hover:bg-white/40"
                          )}
                        >
                          <div className="relative shrink-0">
                            {member.avatar ? (
                              <img src={member.avatar} alt="" className="h-10 w-10 rounded-xl object-cover" />
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-200 text-stone-600">
                                <span className="text-sm font-semibold">{member.name.charAt(0)}</span>
                              </div>
                            )}
                            <div className={cn(
                              "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-1 ring-white",
                              status === 'online' ? "bg-emerald-500" : status === 'away' ? "bg-amber-500" : "bg-stone-400"
                            )} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-stone-950 truncate">{member.name}</p>
                            <p className="text-xs text-stone-500 capitalize">{member.role}</p>
                            {member.studentId && <p className="text-xs text-stone-400 truncate">{member.studentId}</p>}
                          </div>
                          {isSelected && <Check className="h-5 w-5 text-[#9d7443] shrink-0" />}
                        </button>
                      );
                    })}
                    
                    {filteredMembers.length === 0 && (
                      <div className="text-center py-8">
                        <Users className="h-10 w-10 text-stone-300 mx-auto mb-3" />
                        <p className="text-stone-500">No users found</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="border-t border-white/40 p-4 bg-white/20 shrink-0">
              <div className="flex gap-3">
                {step === 'members' && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep('info')}
                    className="flex-1 rounded-xl border border-stone-300 bg-white/50 px-4 py-2.5 text-sm font-semibold text-stone-700 hover:bg-white transition flex items-center justify-center gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </motion.button>
                )}
                
                {step === 'info' ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep('members')}
                    disabled={!canProceed}
                    className={cn(
                      "flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition flex items-center justify-center gap-2",
                      canProceed ? "bg-[#9d7443] text-white hover:bg-[#b08f5a]" : "bg-stone-300 text-stone-500 cursor-not-allowed"
                    )}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreate}
                    disabled={!canProceed}
                    className={cn(
                      "flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition",
                      canProceed ? "bg-[#9d7443] text-white hover:bg-[#b08f5a]" : "bg-stone-300 text-stone-500 cursor-not-allowed"
                    )}
                  >
                    Create Group
                  </motion.button>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-stone-300 bg-white/50 px-4 py-2.5 text-sm font-semibold text-stone-700 hover:bg-white transition"
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
// app/(platform)/operations/chat/_components/ChatInterface.tsx
'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ConversationList } from './ConversationList';
import { ChatArea } from './ChatArea';
import { SearchUsersModal } from './SearchUsersModal';
import { CreateGroupModal } from './CreateGroupModal';
import { Conversation, Message, User } from './types';
import { conversations as initialConversations, currentUser, getMessagesForConversation, allUsers } from './mockData';

export function ChatInterface() {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showSearchUsers, setShowSearchUsers] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setMessages(getMessagesForConversation(conversation.id));
    setIsMobileMenuOpen(false);
    
    setConversations(prev => prev.map(conv => 
      conv.id === conversation.id ? { ...conv, unreadCount: 0 } : conv
    ));
  };

  const handleSendMessage = (content: string, type: 'text' | 'image' | 'file', fileUrl?: string, fileName?: string) => {
    if (!selectedConversation) return;
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      timestamp: new Date().toISOString(),
      type,
      fileUrl,
      fileName,
      isRead: false,
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation.id 
        ? { ...conv, lastMessage: newMessage, updatedAt: new Date().toISOString() }
        : conv
    ));
  };

  const handleStartNewChat = (user: User) => {
    const existingConv = conversations.find(
      conv => conv.type === 'direct' && conv.participants.some(p => p.id === user.id)
    );
    
    if (existingConv) {
      handleSelectConversation(existingConv);
    } else {
      const newParticipant = {
        id: user.id,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        status: user.status || 'offline',
        lastSeen: user.lastSeen,
        studentId: user.studentId,
        department: user.department,
        email: user.email,
      };
      
      const newConversation: Conversation = {
        id: `conv-${Date.now()}`,
        type: 'direct',
        name: user.name,
        avatar: user.avatar,
        participants: [newParticipant, {
          id: currentUser.id,
          name: currentUser.name,
          role: currentUser.role,
          avatar: currentUser.avatar,
          status: 'online',
        }],
        lastMessage: {
          id: 'empty',
          content: 'No messages yet',
          senderId: '',
          senderName: '',
          timestamp: new Date().toISOString(),
          type: 'text',
          isRead: true,
        },
        unreadCount: 0,
        updatedAt: new Date().toISOString(),
      };
      setConversations(prev => [newConversation, ...prev]);
      setSelectedConversation(newConversation);
      setMessages([]);
    }
    setShowSearchUsers(false);
  };

  const handleGroupCreated = (group: any) => {
    const newConversation: Conversation = {
      id: `group-${Date.now()}`,
      type: 'group',
      name: group.name,
      avatar: group.avatar,
      participants: [
        ...group.members.map((m: string) => {
          const user = allUsers.find(u => u.id === m);
          return {
            id: user?.id || m,
            name: user?.name || m,
            role: user?.role || 'student',
            avatar: user?.avatar,
            status: 'offline' as const,
          };
        }),
        {
          id: currentUser.id,
          name: currentUser.name,
          role: currentUser.role,
          avatar: currentUser.avatar,
          status: 'online',
        }
      ],
      lastMessage: {
        id: 'empty',
        content: 'Group created',
        senderId: currentUser.id,
        senderName: currentUser.name,
        timestamp: new Date().toISOString(),
        type: 'text',
        isRead: true,
      },
      unreadCount: 0,
      updatedAt: new Date().toISOString(),
    };
    setConversations(prev => [newConversation, ...prev]);
    setSelectedConversation(newConversation);
    setMessages([]);
  };

  return (
    <div className="relative flex h-full w-full overflow-hidden rounded-[2rem] border border-white/55 bg-[#ebe4d8] shadow-[0_30px_80px_-55px_rgba(38,35,31,0.72)]">
      {/* Background gradients - matching other pages */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(255,255,255,0.9),transparent_28%),radial-gradient(circle_at_58%_42%,rgba(194,160,107,0.3),transparent_24%),radial-gradient(circle_at_88%_18%,rgba(87,75,59,0.2),transparent_26%),linear-gradient(135deg,rgba(255,255,255,0.54),rgba(150,137,116,0.24))]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-[linear-gradient(to_top,rgba(67,59,49,0.24),rgba(232,224,211,0.04),transparent)]" />
      
      <div className="relative flex h-full w-full">
        {/* Conversation List - Sidebar */}
        <div className={cn(
          "absolute inset-y-0 left-0 z-20 w-96 border-r border-white/40 bg-white/20 backdrop-blur-xl transition-transform duration-300 lg:relative lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}>
          <ConversationList
            conversations={conversations}
            selectedId={selectedConversation?.id}
            onSelect={handleSelectConversation}
            currentUser={currentUser}
            onNewChat={() => setShowSearchUsers(true)}
            onCreateGroup={() => setShowCreateGroup(true)}
          />
        </div>
        
        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <ChatArea
            conversation={selectedConversation}
            messages={messages}
            currentUser={currentUser}
            onSendMessage={handleSendMessage}
            onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </div>
      </div>
      
      <SearchUsersModal
        isOpen={showSearchUsers}
        onClose={() => setShowSearchUsers(false)}
        onSelectUser={handleStartNewChat}
        currentUser={currentUser}
        existingConversations={conversations}
      />
      
      <CreateGroupModal
        isOpen={showCreateGroup}
        onClose={() => setShowCreateGroup(false)}
        currentUser={currentUser}
        onGroupCreated={handleGroupCreated}
      />
    </div>
  );
}
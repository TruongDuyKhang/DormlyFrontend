// app/(platform)/operations/chat/_components/ChatArea.tsx
'use client';

import { useRef, useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Conversation, Message, User } from './types';
import { ChatHeader } from './ChatHeader';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { SearchInChatModal } from './SearchInChatModal';

interface ChatAreaProps {
  conversation: Conversation | null;
  messages: Message[];
  currentUser: User;
  onSendMessage: (content: string, type: 'text' | 'image' | 'file', fileUrl?: string, fileName?: string) => void;
  onMenuToggle: () => void;
}

export function ChatArea({ conversation, messages, currentUser, onSendMessage, onMenuToggle }: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showSearchInChat, setShowSearchInChat] = useState(false);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleRenameConversation = () => {
    console.log('Rename conversation');
  };
  
  const handleArchiveConversation = () => {
    console.log('Archive conversation');
  };
  
  const handleDeleteConversation = () => {
    console.log('Delete conversation');
  };
  
  const handleSearchInChat = (query: string) => {
    console.log('Search in chat:', query);
  };
  
  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/30">
            <MessageCircle className="h-10 w-10 text-stone-400" />
          </div>
          <h3 className="text-lg font-medium text-stone-700">No conversation selected</h3>
          <p className="mt-1 text-sm text-stone-500">Select a conversation to start messaging</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <style>{`
        .messages-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .messages-scroll::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.08);
          border-radius: 3px;
        }
        .messages-scroll::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.4);
          border-radius: 3px;
          transition: background 0.2s;
        }
        .messages-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.6);
        }
        .messages-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 0, 0, 0.4) rgba(0, 0, 0, 0.08);
        }
      `}</style>
      
      <div className="flex h-full flex-col overflow-hidden">
        <ChatHeader
          conversation={conversation}
          onMenuToggle={onMenuToggle}
          onRename={handleRenameConversation}
          onArchive={handleArchiveConversation}
          onDelete={handleDeleteConversation}
          onSearchInChat={() => setShowSearchInChat(true)}
        />
        
        <div className="messages-scroll flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map((message, idx) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.senderId === currentUser.id}
              showAvatar={idx === 0 || messages[idx - 1]?.senderId !== message.senderId}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <MessageInput onSend={onSendMessage} />
      </div>
      
      <SearchInChatModal
        isOpen={showSearchInChat}
        onClose={() => setShowSearchInChat(false)}
        messages={messages}
        onSearchResult={(messageId) => {
          const element = document.getElementById(`msg-${messageId}`);
          element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setShowSearchInChat(false);
        }}
      />
    </>
  );
}
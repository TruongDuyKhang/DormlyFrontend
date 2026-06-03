// app/(student)/chat/_components/ai-chat.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, User } from 'lucide-react';
import { MessageInput } from './message-input';
import { getAiResponse } from './ai-faq';
import type { AiMessage } from './types';

interface AiChatProps {
  initialQuestion?: string;
}

export function AiChat({ initialQuestion }: AiChatProps) {
  const [messages, setMessages] = useState<AiMessage[]>([
    {
      id: 'welcome',
      content: "Hi! I'm Dormly AI. How can I help you today?",
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (initialQuestion) {
      handleSend(initialQuestion);
    }
  }, [initialQuestion]);

  const handleSend = async (text: string) => {
    const userMessage: AiMessage = {
      id: Date.now().toString(),
      content: text,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    const response = await getAiResponse(text);
    
    const aiMessage: AiMessage = {
      id: (Date.now() + 1).toString(),
      content: response,
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(false);
  };

  return (
    <div className="flex h-full flex-col rounded-xl border border-stone-200/70 bg-white">
      <div className="flex items-center gap-3 border-b border-stone-100 p-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2f2a24]">
          <Bot className="h-5 w-5 text-[#d6bd8a]" />
        </div>
        <div>
          <p className="font-semibold text-stone-900">Dormly AI</p>
          <p className="text-xs text-stone-500">AI Assistant • Online</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className="flex items-start gap-2 max-w-[80%]">
              {message.sender === 'ai' && (
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#2f2a24]">
                  <Bot className="h-4 w-4 text-[#d6bd8a]" />
                </div>
              )}
              <div
                className={`rounded-2xl px-4 py-2 ${
                  message.sender === 'user'
                    ? 'bg-[#2f2a24] text-white'
                    : 'bg-stone-100 text-stone-800'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p
                  className={`mt-1 text-right text-xs ${
                    message.sender === 'user' ? 'text-stone-400' : 'text-stone-500'
                  }`}
                >
                  {message.timestamp}
                </p>
              </div>
              {message.sender === 'user' && (
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-stone-200">
                  <User className="h-4 w-4 text-stone-600" />
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl bg-stone-100 px-4 py-2">
              <div className="h-2 w-2 animate-bounce rounded-full bg-stone-400 [animation-delay:-0.3s]" />
              <div className="h-2 w-2 animate-bounce rounded-full bg-stone-400 [animation-delay:-0.15s]" />
              <div className="h-2 w-2 animate-bounce rounded-full bg-stone-400" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-stone-100 p-3">
        <MessageInput onSend={handleSend} placeholder="Ask me anything..." />
      </div>
    </div>
  );
}
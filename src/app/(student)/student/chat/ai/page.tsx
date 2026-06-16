// app/(student)/chat/ai/page.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, User, Sparkles, Send, Loader2 } from 'lucide-react';
import { ChatTabs } from '../_components/chat-tabs';
import { faqDatabase } from '../_components/ai-faq';
import { getAiResponse } from '../_components/ai-faq';
import type { AiMessage } from '../_components/types';

export default function AiPage() {
  const [messages, setMessages] = useState<AiMessage[]>([
    {
      id: 'welcome',
      content: "Hi! I'm Dormly AI. How can I help you today?",
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isSending) return;

    const userMessage: AiMessage = {
      id: Date.now().toString(),
      content: text.trim(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsSending(true);
    setIsTyping(true);

    const response = await getAiResponse(text.trim());

    const aiMessage: AiMessage = {
      id: (Date.now() + 1).toString(),
      content: response,
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(false);
    setIsSending(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  const handleSuggestionClick = (question: string) => {
    handleSend(question);
  };

  // Categories - bỏ event, không icon
  const categories = [
    { key: 'transfer', label: 'Room Transfer' },
    { key: 'maintenance', label: 'Maintenance & Issues' },
    { key: 'documents', label: 'Documents' },
    { key: 'policy', label: 'Policies' },
  ];

  return (
    <div className="space-y-6 pb-24 lg:pb-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-stone-500">Communication</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[#28231f] sm:text-5xl">Dormly AI</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">Your AI assistant for residence questions</p>
        </div>
        <ChatTabs />
      </div>

      {/* Chat Layout - 2 columns */}
      <div className="grid h-[600px] gap-6 lg:grid-cols-[1fr_340px]">
        {/* Chat Area */}
        <div className="flex flex-col rounded-xl border border-stone-200/70 bg-white overflow-hidden">
          {/* Chat Header */}
          <div className="flex items-center gap-3 border-b border-stone-100 p-3 bg-white/50 shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2f2a24]">
              <Bot className="h-5 w-5 text-[#d6bd8a]" />
            </div>
            <div>
              <p className="font-semibold text-stone-900">Dormly AI</p>
              <p className="text-xs text-stone-500">AI Assistant • Online</p>
            </div>
          </div>

          {/* Messages - Scroll đẹp */}
          <div 
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-stone-300 scrollbar-track-stone-100"
          >
            <style>{`
              .scrollbar-thin::-webkit-scrollbar {
                width: 5px;
              }
              .scrollbar-thin::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 10px;
              }
              .scrollbar-thin::-webkit-scrollbar-thumb {
                background: #d1d1d1;
                border-radius: 10px;
              }
              .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                background: #b1b1b1;
              }
            `}</style>
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex items-start gap-2 max-w-[80%]">
                  {message.sender === 'ai' && (
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#2f2a24] mt-1">
                      <Bot className="h-4 w-4 text-[#d6bd8a]" />
                    </div>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-2.5 ${
                      message.sender === 'user'
                        ? 'bg-[#2f2a24] text-white'
                        : 'bg-stone-100 text-stone-800'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                      {message.content}
                    </p>
                    <p
                      className={`mt-1 text-right text-[10px] ${
                        message.sender === 'user' ? 'text-stone-400' : 'text-stone-400'
                      }`}
                    >
                      {message.timestamp}
                    </p>
                  </div>
                  {message.sender === 'user' && (
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-stone-200 mt-1">
                      <User className="h-4 w-4 text-stone-600" />
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl bg-stone-100 px-4 py-2.5">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-stone-400 [animation-delay:-0.3s]" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-stone-400 [animation-delay:-0.15s]" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-stone-400" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-stone-100 p-3 bg-white/50 shrink-0">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 rounded-full border border-stone-200 px-4 py-2.5 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#9d7443]/30 transition"
                disabled={isSending}
              />
              <button
                onClick={() => handleSend(input)}
                disabled={!input.trim() || isSending}
                className="rounded-full bg-[#2f2a24] px-4 py-2.5 text-white transition hover:bg-[#40382f] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Sidebar */}
        <div className="rounded-xl border border-stone-200/70 bg-white p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-stone-300 scrollbar-track-stone-100">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-[#9d7443]" />
            <h2 className="text-lg font-semibold text-stone-900">Quick Questions</h2>
          </div>

          <div className="space-y-4">
            {categories.map((cat) => {
              const items = faqDatabase.filter(item => item.category === cat.key);
              if (items.length === 0) return null;
              return (
                <div key={cat.key}>
                  <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500 mb-2">
                    {cat.label}
                  </h3>
                  <div className="space-y-2">
                    {items.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(item.question)}
                        className="w-full text-left rounded-lg border border-stone-200 px-3 py-2.5 text-sm text-stone-700 transition hover:border-[#9d7443] hover:bg-amber-50 active:scale-[0.98]"
                      >
                        {item.question}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty state */}
          {categories.every(cat => faqDatabase.filter(item => item.category === cat.key).length === 0) && (
            <div className="py-8 text-center text-stone-500 text-sm">
              No FAQ available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
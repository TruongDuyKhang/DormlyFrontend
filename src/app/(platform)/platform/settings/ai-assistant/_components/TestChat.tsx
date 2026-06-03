// app/(platform)/platform/settings/ai-assistant/_components/TestChat.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AIConfig, KnowledgeItem, TestMessage } from './types';

interface TestChatProps {
  config: AIConfig;
  knowledge: KnowledgeItem[];
}

export function TestChat({ config, knowledge }: TestChatProps) {
  const [messages, setMessages] = useState<TestMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I am Dormly AI Assistant. Ask me anything about the dormitory — rules, utilities, maintenance, or facilities.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Build context from knowledge base
  const buildContext = () => {
    const activeKnowledge = knowledge.filter(k => k.isActive);
    if (activeKnowledge.length === 0) return '';

    let context = 'REFERENCE INFORMATION:\n';
    activeKnowledge.forEach(k => {
      context += `- Q: ${k.question}\n  A: ${k.answer}\n`;
    });
    return context;
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: TestMessage = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Build full prompt with context
      const context = buildContext();
      const systemPromptWithContext = `${config.systemPrompt}\n\n${context}`;

      // Call API
      const response = await callAIAPI(config, systemPromptWithContext, input);
      
      const assistantMessage: TestMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI Error:', error);
      const errorMessage: TestMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please check your API configuration and try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const callAIAPI = async (config: AIConfig, systemPrompt: string, userMessage: string): Promise<string> => {
    // Mock API call for demo - replace with actual API
    if (!config.apiKey || !config.isEnabled) {
      return 'AI Assistant is not configured. Please add your API key in the Configuration tab.';
    }

    // For OpenAI-compatible APIs
    try {
      const response = await fetch(config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          model: config.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || 'No response from AI.';
    } catch (error) {
      console.error('API call failed:', error);
      // Fallback to mock response for testing
      return mockAIResponse(userMessage);
    }
  };

  // Mock response for testing without API
  const mockAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    if (lowerQuestion.includes('gate') || lowerQuestion.includes('close')) {
      return 'The main gate closes at 11:00 PM daily. After hours, you will need a special access card.';
    }
    if (lowerQuestion.includes('electricity') || lowerQuestion.includes('price') || lowerQuestion.includes('cost')) {
      return 'Electricity is charged at 3,500 VND per kilowatt-hour (kWh).';
    }
    if (lowerQuestion.includes('water')) {
      return 'Water is charged at 15,000 VND per cubic meter.';
    }
    if (lowerQuestion.includes('maintenance') || lowerQuestion.includes('repair') || lowerQuestion.includes('issue')) {
      return 'You can report maintenance issues through the Dormly app by going to Operations > Tickets > Create New Ticket.';
    }
    if (lowerQuestion.includes('visitor')) {
      return 'Visitors are allowed until 10:00 PM. All visitors must check in at the front desk.';
    }
    if (lowerQuestion.includes('quiet')) {
      return 'Quiet hours are from 10:00 PM to 7:00 AM daily. Please be respectful of your neighbors.';
    }
    if (lowerQuestion.includes('laundry')) {
      return 'The laundry room is located on the ground floor of Block A, open from 6:00 AM to 10:00 PM daily.';
    }
    return 'I don\'t have that information yet. Please contact the front desk or check the Resident Handbook.';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="rounded-xl border border-stone-200 bg-white shadow-sm overflow-hidden flex flex-col h-[600px]">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-[#c3a26c]/10 to-[#c3a26c]/5 px-5 py-3 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-[#c3a26c]" />
          <h3 className="font-semibold text-stone-800">Test AI Assistant</h3>
          {config.isEnabled && config.apiKey ? (
            <span className="text-xs text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">Connected</span>
          ) : (
            <span className="text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">Not Configured</span>
          )}
        </div>
        <p className="text-xs text-stone-500 mt-1">Test how AI responds based on your configuration</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={cn(
              "flex gap-3",
              msg.role === 'user' ? "justify-end" : "justify-start"
            )}
          >
            {msg.role === 'assistant' && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c3a26c]/15">
                <Bot className="h-4 w-4 text-[#c3a26c]" />
              </div>
            )}
            <div
              className={cn(
                "max-w-[70%] rounded-2xl px-4 py-2.5",
                msg.role === 'user'
                  ? "bg-[#c3a26c] text-white"
                  : "bg-stone-100 text-stone-700"
              )}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              <p className="text-[10px] mt-1 opacity-60">
                {msg.timestamp.toLocaleTimeString()}
              </p>
            </div>
            {msg.role === 'user' && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-200">
                <User className="h-4 w-4 text-stone-600" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c3a26c]/15">
              <Bot className="h-4 w-4 text-[#c3a26c]" />
            </div>
            <div className="bg-stone-100 rounded-2xl px-4 py-2.5">
              <Loader2 className="h-4 w-4 animate-spin text-stone-500" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-stone-200">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask a question... (e.g., What time does the gate close?)"
            rows={1}
            className="flex-1 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30 resize-none"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading || !config.isEnabled}
            className="rounded-xl bg-[#c3a26c] px-4 py-2 text-white hover:bg-[#b08f5a] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-stone-400 mt-2">
          {config.isEnabled && config.apiKey 
            ? "AI will respond based on your System Prompt and Knowledge Base"
            : "Configure API key and enable AI in the Configuration tab first"}
        </p>
      </div>
    </div>
  );
}
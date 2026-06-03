// app/(student)/chat/ai/page.tsx
'use client';

import { useState } from 'react';
import { ChatTabs } from '../_components/chat-tabs';
import { AiSuggestions } from '../_components/ai-suggestions';
import { AiQuickActions } from '../_components/ai-quick-actions';
import { AiChat } from '../_components/ai-chat';

export default function AiPage() {
  const [showChat, setShowChat] = useState(false);
  const [initialQuestion, setInitialQuestion] = useState('');

  const handleSelectSuggestion = (question: string, answer: string) => {
    setInitialQuestion(question);
    setShowChat(true);
  };

  if (showChat) {
    return (
      <div className="space-y-6 pb-24 lg:pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-stone-500">Communication</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[#28231f] sm:text-5xl">Dormly AI</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">Your AI assistant for residence questions</p>
          </div>
          <ChatTabs />
        </div>

        <div className="h-[600px]">
          <AiChat initialQuestion={initialQuestion} />
        </div>

        <button onClick={() => setShowChat(false)} className="text-sm text-stone-500 hover:text-stone-700">
          ← Back to suggestions
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 lg:pb-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-stone-500">Communication</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[#28231f] sm:text-5xl">Dormly AI</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">Your AI assistant for residence questions</p>
        </div>
        <ChatTabs />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-stone-200/70 bg-white p-6">
          <AiSuggestions onSelect={handleSelectSuggestion} />
        </div>

        <div className="space-y-6">
          <AiQuickActions />
          
          <div className="rounded-xl border border-stone-200/70 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold text-stone-900">Frequently Asked</h3>
            <div className="space-y-2">
              {['Room Transfer', 'Internet Issues', 'Residence Documents', 'Quiet Hours', 'Event Participation'].map((topic) => (
                <button
                  key={topic}
                  onClick={() => {
                    const question = `How do I ${topic.toLowerCase()}?`;
                    const answer = `For ${topic.toLowerCase()}, please go to the relevant section in the app or contact the residence office.`;
                    handleSelectSuggestion(question, answer);
                  }}
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm text-stone-600 transition hover:bg-stone-100"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
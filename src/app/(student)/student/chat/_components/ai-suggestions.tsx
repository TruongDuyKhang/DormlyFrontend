// app/(student)/chat/_components/ai-suggestions.tsx
'use client';

import { Sparkles } from 'lucide-react';
import { faqDatabase } from './ai-faq';

interface AiSuggestionsProps {
  onSelect: (question: string, answer: string) => void;
}

export function AiSuggestions({ onSelect }: AiSuggestionsProps) {
  const categories = {
    transfer: { label: 'Room Transfer', items: [] as typeof faqDatabase },
    maintenance: { label: 'Maintenance & Issues', items: [] as typeof faqDatabase },
    documents: { label: 'Documents', items: [] as typeof faqDatabase },
    policy: { label: 'Policies', items: [] as typeof faqDatabase },
    event: { label: 'Events', items: [] as typeof faqDatabase },
  };
  
  faqDatabase.forEach(item => {
    categories[item.category].items.push(item);
  });
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-[#9d7443]" />
        <h2 className="text-lg font-semibold text-stone-900">How can I help today?</h2>
      </div>

      {Object.entries(categories).map(([key, cat]) => (
        cat.items.length > 0 && (
          <div key={key}>
            <h3 className="mb-3 text-sm font-medium text-stone-500">{cat.label}</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {cat.items.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelect(item.question, item.answer)}
                  className="rounded-xl border border-stone-200 bg-white p-3 text-left text-sm text-stone-700 transition hover:border-[#9d7443] hover:bg-amber-50"
                >
                  {item.question}
                </button>
              ))}
            </div>
          </div>
        )
      ))}
    </div>
  );
}
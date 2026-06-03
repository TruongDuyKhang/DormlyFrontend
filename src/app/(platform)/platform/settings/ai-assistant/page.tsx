// app/(platform)/platform/settings/ai-assistant/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Brain, BookOpen, Settings2, Zap, Server, MessageSquare } from 'lucide-react';
import { AIConfigTab } from './_components/AIConfigTab';
import { KnowledgeTab } from './_components/KnowledgeTab';
import { TestChat } from './_components/TestChat';
import { AIConfig, KnowledgeItem } from './_components/types';
import { defaultAIConfig, defaultKnowledge } from './_components/mockData';
import { cn } from '@/lib/utils';

type TabType = 'config' | 'knowledge' | 'test';

export default function AIAssistantPage() {
  const [activeTab, setActiveTab] = useState<TabType>('config');
  const [config, setConfig] = useState<AIConfig>(defaultAIConfig);
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>(defaultKnowledge);

  // Load from localStorage on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('dormly_ai_config');
    const savedKnowledge = localStorage.getItem('dormly_ai_knowledge');
    if (savedConfig) setConfig(JSON.parse(savedConfig));
    if (savedKnowledge) setKnowledge(JSON.parse(savedKnowledge));
  }, []);

  const handleSaveConfig = (newConfig: AIConfig) => {
    setConfig(newConfig);
    localStorage.setItem('dormly_ai_config', JSON.stringify(newConfig));
  };

  const handleSaveKnowledge = (newKnowledge: KnowledgeItem[]) => {
    setKnowledge(newKnowledge);
    localStorage.setItem('dormly_ai_knowledge', JSON.stringify(newKnowledge));
  };

  const tabs = [
    { id: 'config' as const, label: 'Configuration', description: 'API & System Prompt', icon: Settings2 },
    { id: 'knowledge' as const, label: 'Knowledge Base', description: 'Q&A for AI', icon: BookOpen },
    { id: 'test' as const, label: 'Test Chat', description: 'Try AI responses', icon: MessageSquare },
  ];

  const getStatusBadge = () => {
    if (!config.isEnabled) {
      return { label: 'AI Disabled', color: 'bg-stone-200 text-stone-600' };
    }
    if (config.apiKey) {
      return { label: 'AI Connected', color: 'bg-emerald-100 text-emerald-700' };
    }
    return { label: 'AI Not Configured', color: 'bg-amber-100 text-amber-700' };
  };

  const status = getStatusBadge();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="relative min-h-[calc(100dvh-8rem)] overflow-hidden rounded-[2rem] border border-white/55 bg-[#ebe4d8] text-[#26231f] shadow-[0_30px_80px_-55px_rgba(38,35,31,0.72)]"
      >
        {/* Background Gradients */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(255,255,255,0.9),transparent_28%),radial-gradient(circle_at_58%_42%,rgba(194,160,107,0.3),transparent_24%),radial-gradient(circle_at_88%_18%,rgba(87,75,59,0.2),transparent_26%),linear-gradient(135deg,rgba(255,255,255,0.54),rgba(150,137,116,0.24))]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-[linear-gradient(to_top,rgba(67,59,49,0.24),rgba(232,224,211,0.04),transparent)]" />

        <div className="relative p-4 sm:p-6 2xl:p-7">
          {/* Header */}
          <div className="mb-6">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/34 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-stone-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-xl">
              <Bot className="h-3.5 w-3.5" />
              AI Intelligence
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-3xl font-semibold leading-[1.02] tracking-tight text-[#28241f] md:text-5xl">
                  AI Assistant
                </h1>
                <p className="mt-2 text-sm text-stone-600">
                  Configure AI behavior, manage knowledge base, and monitor responses
                </p>
              </div>
              <div className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium", status.color)}>
                <Zap className="h-3 w-3" />
                {status.label}
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 border-b border-white/40 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "group flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all",
                  activeTab === tab.id
                    ? "border-b-2 border-[#c3a26c] text-[#c3a26c]"
                    : "text-stone-500 hover:text-stone-700"
                )}
              >
                <tab.icon className={cn(
                  "h-4 w-4 transition",
                  activeTab === tab.id ? "text-[#c3a26c]" : "text-stone-400 group-hover:text-stone-500"
                )} />
                <div className="flex flex-col items-start">
                  <span>{tab.label}</span>
                  <span className="text-xs font-light text-stone-400">{tab.description}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeTab === 'config' && (
              <AIConfigTab config={config} onSave={handleSaveConfig} />
            )}
            {activeTab === 'knowledge' && (
              <KnowledgeTab knowledge={knowledge} onSave={handleSaveKnowledge} />
            )}
            {activeTab === 'test' && (
              <TestChat config={config} knowledge={knowledge} />
            )}
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
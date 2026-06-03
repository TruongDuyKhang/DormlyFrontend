// app/(platform)/platform/settings/ai-assistant/_components/AIConfigTab.tsx
'use client';

import { useState } from 'react';
import { Save, Eye, EyeOff, Zap, Globe, Key, Bot, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AIConfig } from './types';
import { defaultAIConfig } from './mockData';

interface AIConfigTabProps {
  config: AIConfig;
  onSave: (config: AIConfig) => void;
}

export function AIConfigTab({ config: initialConfig, onSave }: AIConfigTabProps) {
  const [config, setConfig] = useState<AIConfig>(initialConfig);
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSave = () => {
    onSave(config);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-xl bg-[#c3a26c] px-4 py-2 text-sm font-semibold text-white hover:bg-[#b08f5a] transition shadow-sm"
        >
          <Save className="h-4 w-4" />
          Save Configuration
        </button>
      </div>

      {/* API Configuration */}
      <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c3a26c]/15">
            <Globe className="h-5 w-5 text-[#c3a26c]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-stone-900">API Configuration</h3>
            <p className="text-sm text-stone-500">Connect to your AI provider</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-stone-700 block mb-1">API Endpoint</label>
            <input
              type="text"
              value={config.apiEndpoint}
              onChange={(e) => setConfig({ ...config, apiEndpoint: e.target.value })}
              placeholder="https://api.openai.com/v1/chat/completions"
              className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-stone-700 block mb-1">API Key</label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={config.apiKey}
                onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                placeholder="sk-..."
                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 pr-12 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-stone-400 mt-1">Store API key securely. Never share this key.</p>
          </div>

          <div>
            <label className="text-sm font-medium text-stone-700 block mb-1">Model</label>
            <select
              value={config.model}
              onChange={(e) => setConfig({ ...config, model: e.target.value })}
              className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30"
            >
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Fast, Cost-effective)</option>
              <option value="gpt-4">GPT-4 (More accurate, Slower)</option>
              <option value="gpt-4-turbo">GPT-4 Turbo (Best balance)</option>
              <option value="claude-3-haiku">Claude 3 Haiku (Fast)</option>
              <option value="claude-3-sonnet">Claude 3 Sonnet (Balanced)</option>
              <option value="mistral">Mistral (Open source)</option>
            </select>
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="text-sm font-medium text-stone-700">Enable AI Assistant</label>
            <button
              onClick={() => setConfig({ ...config, isEnabled: !config.isEnabled })}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                config.isEnabled ? "bg-[#c3a26c]" : "bg-stone-300"
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                  config.isEnabled ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
          </div>
        </div>
      </div>

      {/* System Prompt */}
      <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c3a26c]/15">
            <Bot className="h-5 w-5 text-[#c3a26c]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-stone-900">System Prompt</h3>
            <p className="text-sm text-stone-500">Define AI behavior and knowledge base</p>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-stone-700 block mb-2">Instructions for AI</label>
          <textarea
            value={config.systemPrompt}
            onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
            rows={12}
            placeholder="You are Dormly AI Assistant..."
            className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30 font-mono"
          />
          <p className="text-xs text-stone-400 mt-2">
            The system prompt defines how AI responds. Include dormitory rules, pricing, and FAQs here.
          </p>
        </div>
      </div>
    </div>
  );
}
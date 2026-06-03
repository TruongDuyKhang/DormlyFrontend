// app/(platform)/platform/settings/ai-assistant/_components/types.ts

export interface AIConfig {
  apiEndpoint: string;
  apiKey: string;
  model: string;
  systemPrompt: string;
  isEnabled: boolean;
}

export interface KnowledgeItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
}

export interface TestMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
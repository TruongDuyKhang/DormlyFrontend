// app/(platform)/platform/settings/ai-assistant/_components/mockData.ts

import { AIConfig, KnowledgeItem } from './types';

export const defaultAIConfig: AIConfig = {
  apiEndpoint: 'https://api.openai.com/v1/chat/completions',
  apiKey: '',
  model: 'gpt-3.5-turbo',
  systemPrompt: `You are Dormly AI Assistant, a helpful assistant for dormitory residents.

You have access to the following information:

GENERAL RULES:
- Gate closes at 11:00 PM daily
- Quiet hours: 10:00 PM - 7:00 AM
- No cooking in rooms (shared kitchen available)
- Visitors allowed until 10:00 PM

UTILITIES:
- Electricity: 3,500 VND/kWh
- Water: 15,000 VND/m³
- WiFi: Included in rent

MAINTENANCE:
- Report issues through the app
- Emergency maintenance: 24/7 hotline 1900xxxx
- Response time: within 24 hours for non-emergency

FACILITIES:
- Laundry room: 6:00 AM - 10:00 PM
- Study room: 24/7
- Gym: 6:00 AM - 9:00 PM

Please answer questions politely, concisely, and only based on this information. If you don't know something, say "I don't have that information yet. Please contact the front desk."`,
  isEnabled: true,
};

export const defaultKnowledge: KnowledgeItem[] = [
  {
    id: '1',
    question: 'What time does the gate close?',
    answer: 'The main gate closes at 11:00 PM daily. After this time, you will need a special access card.',
    category: 'rules',
    isActive: true,
  },
  {
    id: '2',
    question: 'How much is electricity?',
    answer: 'Electricity is charged at 3,500 VND per kilowatt-hour (kWh).',
    category: 'utilities',
    isActive: true,
  },
  {
    id: '3',
    question: 'How do I report a maintenance issue?',
    answer: 'You can report maintenance issues through the Dormly app by going to Operations > Tickets > Create New Ticket.',
    category: 'maintenance',
    isActive: true,
  },
  {
    id: '4',
    question: 'What are the quiet hours?',
    answer: 'Quiet hours are from 10:00 PM to 7:00 AM daily. Please be respectful of your neighbors.',
    category: 'rules',
    isActive: true,
  },
  {
    id: '5',
    question: 'Can I have visitors?',
    answer: 'Yes, visitors are allowed until 10:00 PM. All visitors must check in at the front desk.',
    category: 'rules',
    isActive: true,
  },
  {
    id: '6',
    question: 'What is the water rate?',
    answer: 'Water is charged at 15,000 VND per cubic meter.',
    category: 'utilities',
    isActive: true,
  },
  {
    id: '7',
    question: 'Where is the laundry room?',
    answer: 'The laundry room is located on the ground floor of Block A, open from 6:00 AM to 10:00 PM daily.',
    category: 'facilities',
    isActive: true,
  },
];
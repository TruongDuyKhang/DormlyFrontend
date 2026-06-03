// app/(platform)/operations/chat/page.tsx
'use client';

import { ChatInterface } from './_components/ChatInterface';

export default function ChatPage() {
  return (
    <div className="-m-4 sm:-m-6 lg:-m-7 h-[calc(100dvh-5rem)]">
      <ChatInterface />
    </div>
  );
}
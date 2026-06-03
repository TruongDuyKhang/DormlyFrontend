// app/(platform)/communication/notifications/page.tsx
'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/_components/ui/tabs';
import { Send, History, LayoutTemplate, Bell } from 'lucide-react';
import { CreateNotificationTab, CreateNotificationTabRef } from './_components/CreateNotificationTab';
import { SentNotificationsTab } from './_components/SentNotificationsTab';
import { TemplatesTab } from './_components/TemplatesTab';
import { NotificationTemplate } from './_components/types';

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('create');
  const createTabRef = useRef<CreateNotificationTabRef>(null);
  
  const handleUseTemplate = (template: NotificationTemplate) => {
    setActiveTab('create');
    setTimeout(() => {
      if (createTabRef.current) {
        createTabRef.current.setFormFromTemplate(template);
      }
    }, 100);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      className="relative min-h-[calc(100dvh-8rem)] overflow-hidden rounded-[2rem] border border-white/55 bg-[#ebe4d8] text-[#26231f] shadow-[0_30px_80px_-55px_rgba(38,35,31,0.72)]"
    >
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(255,255,255,0.9),transparent_28%),radial-gradient(circle_at_58%_42%,rgba(194,160,107,0.3),transparent_24%),radial-gradient(circle_at_88%_18%,rgba(87,75,59,0.2),transparent_26%),linear-gradient(135deg,rgba(255,255,255,0.54),rgba(150,137,116,0.24))]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-[linear-gradient(to_top,rgba(67,59,49,0.24),rgba(232,224,211,0.04),transparent)]" />
      <div className="pointer-events-none absolute -left-20 top-24 h-72 w-72 rounded-full bg-white/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-10 h-96 w-96 rounded-full bg-[#9b7a4a]/16 blur-3xl" />

      <div className="relative p-4 sm:p-6 2xl:p-7">
        {/* Header */}
        <div className="mb-6">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/34 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-stone-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-xl">
            <Bell className="h-3.5 w-3.5" />
            Announcements
          </div>
          <h1 className="text-3xl font-semibold leading-[1.02] tracking-tight text-[#28241f] md:text-4xl lg:text-5xl">
            Notification Center
          </h1>
          <p className="mt-2 text-sm text-stone-600">
            Create and manage announcements for residents.
          </p>
        </div>
        
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 inline-flex h-auto w-full justify-start gap-2 rounded-xl bg-white/40 p-1 backdrop-blur-sm">
            <TabsTrigger
              value="create"
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-[#c3a26c] data-[state=active]:text-white data-[state=active]:shadow-sm"
            >
              <Send className="h-4 w-4" />
              Create Notification
            </TabsTrigger>
            <TabsTrigger
              value="sent"
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-[#c3a26c] data-[state=active]:text-white data-[state=active]:shadow-sm"
            >
              <History className="h-4 w-4" />
              Sent Notifications
            </TabsTrigger>
            <TabsTrigger
              value="templates"
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-[#c3a26c] data-[state=active]:text-white data-[state=active]:shadow-sm"
            >
              <LayoutTemplate className="h-4 w-4" />
              Templates
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="mt-0">
            <CreateNotificationTab ref={createTabRef} />
          </TabsContent>
          
          <TabsContent value="sent" className="mt-0">
            <SentNotificationsTab />
          </TabsContent>
          
          <TabsContent value="templates" className="mt-0">
            <TemplatesTab onUseTemplate={handleUseTemplate} />
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
}
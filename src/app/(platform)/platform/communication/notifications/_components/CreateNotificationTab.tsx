// app/(platform)/communication/notifications/_components/CreateNotificationTab.tsx
'use client';

import { forwardRef, useImperativeHandle, useState } from 'react';
import { Send, Calendar, Clock, Mail, Bell, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PriorityBadge } from './PriorityBadge';
import { AudienceSelect } from './AudienceSelect';
import { NotificationPriority, NotificationDelivery, AudienceFilter, NotificationTemplate } from './types';
import { notificationTemplates } from './mockData';

export interface CreateNotificationTabRef {
  setFormFromTemplate: (template: NotificationTemplate) => void;
}

export const CreateNotificationTab = forwardRef<CreateNotificationTabRef>((_props, ref) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<NotificationPriority>('normal');
  const [delivery, setDelivery] = useState<NotificationDelivery>('both');
  const [audience, setAudience] = useState<AudienceFilter>({ type: 'all' });
  const [scheduleType, setScheduleType] = useState<'now' | 'later'>('now');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useImperativeHandle(ref, () => ({
    setFormFromTemplate: (template: NotificationTemplate) => {
      setTitle(template.title);
      setMessage(template.message);
      setPriority(template.priority);
      setDelivery(template.delivery);
      setSelectedTemplate(template.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }));

  const handleUseTemplate = (template: typeof notificationTemplates[0]) => {
    setSelectedTemplate(template.id);
    setTitle(template.title);
    setMessage(template.message);
    setPriority(template.priority);
    setDelivery(template.delivery);
  };

  const handleSend = () => {
    if (!title || !message) return;
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        // Reset form
        setTitle('');
        setMessage('');
        setPriority('normal');
        setDelivery('both');
        setAudience({ type: 'all' });
        setScheduleType('now');
        setSelectedTemplate(null);
      }, 2000);
    }, 1500);
  };

  const isValid = title.trim() && message.trim();

  const priorityConfig = {
    normal: { label: 'Normal', bgColor: 'bg-blue-200', textColor: 'text-blue-800', borderColor: 'border-blue-300' },
    important: { label: 'Important', bgColor: 'bg-amber-200', textColor: 'text-amber-800', borderColor: 'border-amber-300' },
    emergency: { label: 'Emergency', bgColor: 'bg-red-200', textColor: 'text-red-800', borderColor: 'border-red-300' },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Form */}
      <div className="lg:col-span-2 space-y-5">
        {/* Title */}
        <div>
          <label className="text-sm font-medium text-stone-700 block mb-1">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Water Maintenance Schedule"
            className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30"
          />
        </div>

        {/* Message */}
        <div>
          <label className="text-sm font-medium text-stone-700 block mb-1">Message *</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            placeholder="Write your notification message here..."
            className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30 resize-none"
          />
        </div>
        
        {/* Priority */}
        <div>
          <label className="text-sm font-medium text-stone-700 block mb-2">Priority</label>
          <div className="flex gap-3">
            {(['normal', 'important', 'emergency'] as NotificationPriority[]).map((p) => {
              const config = priorityConfig[p];
              return (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={cn(
                    "rounded-xl px-4 py-2 text-sm font-semibold transition border",
                    config.bgColor,
                    config.textColor,
                    config.borderColor,
                    priority === p
                      ? "ring-2 ring-[#c3a26c] ring-offset-1"
                      : "opacity-60 hover:opacity-100"
                  )}
                >
                  {config.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Delivery Channel */}
        <div>
          <label className="text-sm font-medium text-stone-700 block mb-2">Delivery Channel</label>
          <div className="flex gap-3">
            <button
              onClick={() => setDelivery('inapp')}
              className={cn(
                "flex items-center gap-2 rounded-xl border px-4 py-2 text-sm transition",
                delivery === 'inapp'
                  ? "border-[#c3a26c] bg-[#c3a26c]/10 text-[#c3a26c]"
                  : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
              )}
            >
              <Bell className="h-4 w-4" />
              In-app Only
            </button>
            <button
              onClick={() => setDelivery('email')}
              className={cn(
                "flex items-center gap-2 rounded-xl border px-4 py-2 text-sm transition",
                delivery === 'email'
                  ? "border-[#c3a26c] bg-[#c3a26c]/10 text-[#c3a26c]"
                  : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
              )}
            >
              <Mail className="h-4 w-4" />
              Email Only
            </button>
            <button
              onClick={() => setDelivery('both')}
              className={cn(
                "flex items-center gap-2 rounded-xl border px-4 py-2 text-sm transition",
                delivery === 'both'
                  ? "border-[#c3a26c] bg-[#c3a26c]/10 text-[#c3a26c]"
                  : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
              )}
            >
              <Bell className="h-4 w-4" />
              <Mail className="h-4 w-4" />
              Both
            </button>
          </div>
        </div>

        {/* Audience */}
        <div>
          <label className="text-sm font-medium text-stone-700 block mb-2">Audience</label>
          <AudienceSelect value={audience} onChange={setAudience} />
        </div>

        {/* Schedule */}
        <div>
          <label className="text-sm font-medium text-stone-700 block mb-2">Schedule</label>
          <div className="flex gap-3 mb-3">
            <button
              onClick={() => setScheduleType('now')}
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition",
                scheduleType === 'now'
                  ? "bg-[#c3a26c] text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              )}
            >
              <Send className="h-4 w-4" />
              Send Now
            </button>
            <button
              onClick={() => setScheduleType('later')}
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition",
                scheduleType === 'later'
                  ? "bg-[#c3a26c] text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              )}
            >
              <Calendar className="h-4 w-4" />
              Schedule Later
            </button>
          </div>

          {scheduleType === 'later' && (
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm"
              />
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm"
              />
            </div>
          )}
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!isValid || isSending}
          className={cn(
            "w-full rounded-xl py-3 text-sm font-semibold transition flex items-center justify-center gap-2",
            isValid && !isSending
              ? "bg-[#c3a26c] text-white hover:bg-[#b08f5a]"
              : "bg-stone-100 text-stone-400 cursor-not-allowed"
          )}
        >
          {isSending ? (
            <>Sending...</>
          ) : showSuccess ? (
            <>
              <Check className="h-4 w-4" />
              Sent Successfully!
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              {scheduleType === 'now' ? 'Send Notification' : 'Schedule Notification'}
            </>
          )}
        </button>
      </div>

      {/* Templates Sidebar */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="h-5 w-5 text-stone-500" />
          <h3 className="text-base font-semibold text-stone-900">Templates</h3>
        </div>
        <div className="space-y-3">
          {notificationTemplates.map((template) => {
            const config = priorityConfig[template.priority];
            return (
              <div
                key={template.id}
                className={cn(
                  "rounded-xl border p-4 cursor-pointer transition-all",
                  selectedTemplate === template.id
                    ? "border-[#c3a26c] bg-[#c3a26c]/5"
                    : "border-stone-200 bg-white hover:border-stone-300"
                )}
                onClick={() => handleUseTemplate(template)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-semibold text-stone-900">{template.title}</h4>
                  <span className={cn("rounded-md px-2 py-0.5 text-xs font-semibold border", config.bgColor, config.textColor, config.borderColor)}>
                    {config.label}
                  </span>
                </div>
                <p className="text-xs text-stone-500 line-clamp-2 mb-2">{template.message}</p>
                <div className="flex items-center gap-2 text-xs text-stone-400">
                  <span>{template.delivery === 'both' ? 'In-app + Email' : template.delivery}</span>
                  {template.variables && template.variables.length > 0 && (
                    <span>• {template.variables.length} variables</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

CreateNotificationTab.displayName = 'CreateNotificationTab';
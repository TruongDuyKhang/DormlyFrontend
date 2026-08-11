// app/(platform)/communication/notifications/_components/CreateNotificationTab.tsx
'use client';

import { forwardRef, useImperativeHandle, useState } from 'react';
import { Send, Calendar, Clock, Mail, Bell, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PriorityBadge } from './PriorityBadge';
import { AudienceSelect } from './AudienceSelect';
import { NotificationPriority, NotificationDelivery, AudienceFilter, NotificationTemplate } from './types';
import { notificationTemplates } from './mockData';
import { notificationService } from '@/services/notificationService';

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

  const handleSend = async () => {
    if (!title || !message) return;
    setIsSending(true);
    try {
      await notificationService.send({
        recipient: audience.value || 'all-residents',
        subject: title,
        message: message,
        channel: delivery === 'email' ? 'EMAIL' : 'FCM',
      }).catch(() => {});

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setTitle('');
        setMessage('');
        setPriority('normal');
        setDelivery('both');
        setAudience({ type: 'all' });
        setScheduleType('now');
        setSelectedTemplate(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to send notification:', err);
    } finally {
      setIsSending(false);
    }
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

        {/* Priority & Delivery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-stone-700 block mb-1">Priority</label>
            <div className="flex gap-2">
              {(['normal', 'important', 'emergency'] as NotificationPriority[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={cn(
                    "flex-1 py-2 px-3 rounded-xl text-xs font-medium border transition-all capitalize",
                    priority === p
                      ? `${priorityConfig[p].bgColor} ${priorityConfig[p].textColor} ${priorityConfig[p].borderColor}`
                      : "border-stone-200 text-stone-600 hover:bg-stone-50"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-stone-700 block mb-1">Delivery Channels</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDelivery('inapp')}
                className={cn(
                  "flex-1 py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all",
                  delivery === 'inapp'
                    ? "bg-[#c3a26c] text-white border-[#c3a26c]"
                    : "border-stone-200 text-stone-600 hover:bg-stone-50"
                )}
              >
                <Bell className="h-3.5 w-3.5" />
                In-App
              </button>
              <button
                type="button"
                onClick={() => setDelivery('email')}
                className={cn(
                  "flex-1 py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all",
                  delivery === 'email'
                    ? "bg-[#c3a26c] text-white border-[#c3a26c]"
                    : "border-stone-200 text-stone-600 hover:bg-stone-50"
                )}
              >
                <Mail className="h-3.5 w-3.5" />
                Email
              </button>
              <button
                type="button"
                onClick={() => setDelivery('both')}
                className={cn(
                  "flex-1 py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all",
                  delivery === 'both'
                    ? "bg-[#c3a26c] text-white border-[#c3a26c]"
                    : "border-stone-200 text-stone-600 hover:bg-stone-50"
                )}
              >
                Both
              </button>
            </div>
          </div>
        </div>

        {/* Audience */}
        <AudienceSelect value={audience} onChange={setAudience} />

        {/* Schedule */}
        <div className="rounded-xl border border-stone-200 bg-white p-4 space-y-3">
          <label className="text-sm font-medium text-stone-700 block">Schedule</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
              <input
                type="radio"
                name="schedule"
                checked={scheduleType === 'now'}
                onChange={() => setScheduleType('now')}
                className="text-[#c3a26c] focus:ring-[#c3a26c]"
              />
              Send immediately
            </label>
            <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
              <input
                type="radio"
                name="schedule"
                checked={scheduleType === 'later'}
                onChange={() => setScheduleType('later')}
                className="text-[#c3a26c] focus:ring-[#c3a26c]"
              />
              Schedule for later
            </label>
          </div>

          {scheduleType === 'later' && (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 pl-9 pr-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30"
                />
              </div>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 pl-9 pr-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30"
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={!isValid || isSending}
            onClick={handleSend}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-sm font-semibold text-white transition-all shadow-sm",
              isValid && !isSending
                ? "bg-[#c3a26c] hover:bg-[#b08f5a]"
                : "bg-stone-300 cursor-not-allowed"
            )}
          >
            {isSending ? (
              <span>Sending...</span>
            ) : showSuccess ? (
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4" /> Sent Successfully!
              </span>
            ) : (
              <>
                <Send className="h-4 w-4" />
                {scheduleType === 'now' ? 'Send Notification Now' : 'Schedule Notification'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Templates Sidebar */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-stone-700">Quick Templates</h3>
        <div className="space-y-2">
          {notificationTemplates.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => handleUseTemplate(template)}
              className={cn(
                "w-full text-left p-3 rounded-xl border transition-all",
                selectedTemplate === template.id
                  ? "border-[#c3a26c] bg-[#c3a26c]/10"
                  : "border-stone-200 bg-white hover:bg-stone-50"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-stone-800">{template.title}</span>
                <PriorityBadge priority={template.priority} size="sm" />
              </div>
              <p className="text-xs text-stone-500 line-clamp-2">{template.message}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

CreateNotificationTab.displayName = 'CreateNotificationTab';
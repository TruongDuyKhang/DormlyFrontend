// app/(platform)/communication/notifications/_components/types.ts

export type NotificationPriority = 'normal' | 'important' | 'emergency';
export type NotificationDelivery = 'inapp' | 'email' | 'both';
export type NotificationStatus = 'sent' | 'scheduled' | 'draft';

export interface AudienceFilter {
  type: 'all' | 'block' | 'floor' | 'room';
  value?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  priority: NotificationPriority;
  delivery: NotificationDelivery;
  audience: AudienceFilter;
  status: NotificationStatus;
  sentAt: string | null;
  scheduledAt: string | null;
  createdBy: string;
  createdAt: string;
}

export interface NotificationTemplate {
  id: string;
  title: string;
  message: string;
  priority: NotificationPriority;
  delivery: NotificationDelivery;
  variables?: string[];
}

export interface CreateNotificationFormData {
  title: string;
  message: string;
  priority: NotificationPriority;
  delivery: NotificationDelivery;
  audience: AudienceFilter;
  scheduleType: 'now' | 'later';
  scheduledAt: string;
}

export interface Block {
  id: string;
  name: string;
  floors: number[];
}

export interface Room {
  blockId: string;
  floor: number;
  number: string;
}
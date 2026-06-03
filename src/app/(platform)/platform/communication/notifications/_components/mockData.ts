// app/(platform)/communication/notifications/_components/mockData.ts

import { Notification, NotificationTemplate, Block } from './types';

export const blocks: Block[] = [
  { id: 'block-a', name: 'Block A', floors: [1, 2, 3, 4, 5] },
  { id: 'block-b', name: 'Block B', floors: [1, 2, 3, 4, 5] },
  { id: 'block-c', name: 'Block C', floors: [1, 2, 3, 4, 5] },
  { id: 'block-d', name: 'Block D', floors: [1, 2, 3, 4] },
  { id: 'block-e', name: 'Block E', floors: [1, 2, 3] },
];

export const sentNotifications: Notification[] = [
  {
    id: 'notif-1',
    title: 'Water Maintenance Schedule',
    message: 'Water supply will be temporarily unavailable from 08:00 to 12:00 on Saturday.',
    priority: 'important',
    delivery: 'both',
    audience: { type: 'block', value: 'block-a' },
    status: 'sent',
    sentAt: '2025-05-30T10:30:00',
    scheduledAt: null,
    createdBy: 'Mai Tran',
    createdAt: '2025-05-30T10:00:00',
  },
  {
    id: 'notif-2',
    title: 'New Dormitory Regulations',
    message: 'Please review the updated dormitory rules posted on the notice board.',
    priority: 'normal',
    delivery: 'inapp',
    audience: { type: 'all' },
    status: 'sent',
    sentAt: '2025-05-28T14:15:00',
    scheduledAt: null,
    createdBy: 'Linh Vo',
    createdAt: '2025-05-28T14:00:00',
  },
  {
    id: 'notif-3',
    title: 'Fire Drill Notice',
    message: 'A mandatory fire drill will be conducted on Friday at 10:00 AM.',
    priority: 'emergency',
    delivery: 'both',
    audience: { type: 'all' },
    status: 'sent',
    sentAt: '2025-05-25T09:00:00',
    scheduledAt: null,
    createdBy: 'Mai Tran',
    createdAt: '2025-05-25T08:30:00',
  },
  {
    id: 'notif-4',
    title: 'Power Outage Announcement',
    message: 'Electricity will be interrupted for maintenance on Sunday from 14:00 to 16:00.',
    priority: 'important',
    delivery: 'email',
    audience: { type: 'floor', value: 'block-b-floor-3' },
    status: 'sent',
    sentAt: '2025-05-23T11:00:00',
    scheduledAt: null,
    createdBy: 'Khoa Nguyen',
    createdAt: '2025-05-23T10:45:00',
  },
];

export const notificationTemplates: NotificationTemplate[] = [
  {
    id: 'tpl-1',
    title: 'Water Maintenance',
    message: 'Water supply will be temporarily unavailable from {start_time} to {end_time} on {date}. We apologize for the inconvenience.',
    priority: 'important',
    delivery: 'both',
    variables: ['start_time', 'end_time', 'date'],
  },
  {
    id: 'tpl-2',
    title: 'Power Outage',
    message: 'Electricity maintenance is scheduled on {date} from {start_time} to {end_time}. Please prepare accordingly.',
    priority: 'important',
    delivery: 'both',
    variables: ['date', 'start_time', 'end_time'],
  },
  {
    id: 'tpl-3',
    title: 'New Regulations',
    message: 'A new dormitory regulation has been published. Please review the updated rules on the portal.',
    priority: 'normal',
    delivery: 'inapp',
    variables: [],
  },
  {
    id: 'tpl-4',
    title: 'Emergency Notice',
    message: 'Please follow emergency instructions immediately. Stay calm and proceed to the nearest exit.',
    priority: 'emergency',
    delivery: 'both',
    variables: [],
  },
  {
    id: 'tpl-5',
    title: 'Room Inspection',
    message: 'Room inspection will be conducted on {date} between {start_time} and {end_time}. Please ensure your room is accessible.',
    priority: 'normal',
    delivery: 'inapp',
    variables: ['date', 'start_time', 'end_time'],
  },
];
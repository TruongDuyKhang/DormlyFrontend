// app/(platform)/operations/chat/_components/mockData.ts

import { Conversation, Message, Participant, User, userToParticipant } from './types';

export const currentUser: User = {
  id: 'manager-1',
  name: 'Mai Tran',
  email: 'mai.tran@dormly.com',
  role: 'manager',
  status: 'online',
  avatar: 'https://ui-avatars.com/api/?background=c3a26c&color=fff&name=Mai+Tran',
  department: 'Residence Management',
};

export const allUsers: User[] = [
  currentUser,
  { id: 'student-1', name: 'Nguyễn Hải Anh', email: 'anh.nguyen@student.edu', role: 'student', status: 'online', studentId: 'STU001', department: 'Computer Science', avatar: 'https://ui-avatars.com/api/?background=6b7280&color=fff&name=Nguyen+Anh' },
  { id: 'student-2', name: 'Trần Minh Quân', email: 'quan.tran@student.edu', role: 'student', status: 'offline', studentId: 'STU002', department: 'Business', avatar: 'https://ui-avatars.com/api/?background=6b7280&color=fff&name=Tran+Quan', lastSeen: '2024-01-15T10:30:00' },
  { id: 'student-3', name: 'Phạm Thúc Linh', email: 'linh.pham@student.edu', role: 'student', status: 'online', studentId: 'STU003', department: 'Engineering', avatar: 'https://ui-avatars.com/api/?background=6b7280&color=fff&name=Pham+Linh' },
  { id: 'student-4', name: 'Lê Thị Yên', email: 'yen.le@student.edu', role: 'student', status: 'away', studentId: 'STU004', department: 'Psychology', avatar: 'https://ui-avatars.com/api/?background=6b7280&color=fff&name=Le+Yen' },
  { id: 'student-5', name: 'Hoàng Văn Mạnh', email: 'manh.hoang@student.edu', role: 'student', status: 'online', studentId: 'STU005', department: 'Mathematics', avatar: 'https://ui-avatars.com/api/?background=6b7280&color=fff&name=Hoang+Manh' },
  { id: 'student-6', name: 'Võ Minh Khoa', email: 'khoa.vo@student.edu', role: 'student', status: 'offline', studentId: 'STU006', department: 'Physics', avatar: 'https://ui-avatars.com/api/?background=6b7280&color=fff&name=Vo+Khoa' },
  { id: 'manager-2', name: 'Linh Vo', email: 'linh.vo@dormly.com', role: 'manager', status: 'online', department: 'Operations', avatar: 'https://ui-avatars.com/api/?background=c3a26c&color=fff&name=Linh+Vo' },
  { id: 'admin-1', name: 'System Admin', email: 'admin@dormly.com', role: 'admin', status: 'online', department: 'System Administration', avatar: 'https://ui-avatars.com/api/?background=8b5cf6&color=fff&name=Admin' },
];

const generateMessages = (convId: string, count: number): Message[] => {
  const messages: Message[] = [];
  const now = new Date();
  const messageContents = [
    'Hello, I have a question about my room.',
    'When will the maintenance be completed?',
    'The air conditioner in room 501 is not working.',
    'I need to request a room transfer.',
    'Please check the water supply issue.',
    'The common area lights are broken.',
    'Is there any schedule for power outage this week?',
    'My roommate is moving out next month.',
    'Can I extend my contract?',
    'The wifi connection is unstable.',
  ];
  
  for (let i = 0; i < count; i++) {
    const isFromMe = Math.random() > 0.5;
    const date = new Date(now.getTime() - (count - i) * 60000);
    const sender = isFromMe ? currentUser : allUsers[1];
    
    messages.push({
      id: `${convId}-msg-${i}`,
      content: messageContents[i % messageContents.length],
      senderId: sender.id,
      senderName: sender.name,
      senderAvatar: sender.avatar,
      timestamp: date.toISOString(),
      type: 'text',
      isRead: i < count - 2,
    });
  }
  
  return messages;
};

const student1Participant = userToParticipant(allUsers[1]);
const student2Participant = userToParticipant(allUsers[2]);
const student3Participant = userToParticipant(allUsers[3]);
const student4Participant = userToParticipant(allUsers[4]);
const manager2Participant = userToParticipant(allUsers[7]);
const currentUserParticipant = userToParticipant(currentUser);

export const conversations: Conversation[] = [
  {
    id: 'conv-1',
    type: 'direct',
    name: 'Nguyễn Hải Anh',
    avatar: allUsers[1].avatar,
    participants: [student1Participant, currentUserParticipant],
    lastMessage: {
      id: 'last-1',
      content: 'Thank you for your help!',
      senderId: 'student-1',
      senderName: 'Nguyễn Hải Anh',
      timestamp: new Date().toISOString(),
      type: 'text',
      isRead: false,
    },
    unreadCount: 2,
    updatedAt: new Date().toISOString(),
    isPinned: true,
  },
  {
    id: 'conv-2',
    type: 'direct',
    name: 'Trần Minh Quân',
    avatar: allUsers[2].avatar,
    participants: [student2Participant, currentUserParticipant],
    lastMessage: {
      id: 'last-2',
      content: 'When will the repair be done?',
      senderId: 'student-2',
      senderName: 'Trần Minh Quân',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      type: 'text',
      isRead: true,
    },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'conv-3',
    type: 'direct',
    name: 'Phạm Thúc Linh',
    avatar: allUsers[3].avatar,
    participants: [student3Participant, currentUserParticipant],
    lastMessage: {
      id: 'last-3',
      content: 'The water heater is working now. Thanks!',
      senderId: currentUser.id,
      senderName: currentUser.name,
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      type: 'text',
      isRead: true,
    },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'conv-4',
    type: 'group',
    name: 'North House Residents',
    participants: [student1Participant, student2Participant, student3Participant, currentUserParticipant],
    lastMessage: {
      id: 'last-4',
      content: 'Reminder: Monthly maintenance on Friday',
      senderId: currentUser.id,
      senderName: currentUser.name,
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      type: 'text',
      isRead: false,
    },
    unreadCount: 1,
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'conv-5',
    type: 'direct',
    name: 'Linh Vo',
    avatar: allUsers[7].avatar,
    participants: [manager2Participant, currentUserParticipant],
    lastMessage: {
      id: 'last-5',
      content: "Let's review the incident reports together",
      senderId: allUsers[7].id,
      senderName: allUsers[7].name,
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      type: 'text',
      isRead: true,
    },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

export const getMessagesForConversation = (conversationId: string): Message[] => {
  if (conversationId === 'conv-1') return generateMessages('conv-1', 15);
  if (conversationId === 'conv-2') return generateMessages('conv-2', 8);
  if (conversationId === 'conv-3') return generateMessages('conv-3', 12);
  if (conversationId === 'conv-4') return generateMessages('conv-4', 20);
  if (conversationId === 'conv-5') return generateMessages('conv-5', 10);
  return generateMessages(conversationId, 10);
};
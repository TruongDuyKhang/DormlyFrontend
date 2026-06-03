// app/(student)/chat/_components/mock-data.ts

import { Conversation, Message, User, userToParticipant } from './types';

export const currentUser: User = {
  id: 'student-1',
  name: 'Minh Nguyen',
  email: 'minh.nguyen@student.edu',
  role: 'student',
  status: 'online',
  avatar: 'https://ui-avatars.com/api/?background=9d7443&color=fff&name=Minh+Nguyen',
  studentId: 'STU2024001',
  department: 'Computer Science',
};

export const allUsers: User[] = [
  currentUser,
  { id: 'office-1', name: 'Residence Office', email: 'office@dormly.com', role: 'manager', status: 'online', department: 'Residence Management', avatar: 'https://ui-avatars.com/api/?background=c3a26c&color=fff&name=Residence+Office' },
  { id: 'manager-1', name: 'Ms. Lan Pham', email: 'lan.pham@dormly.com', role: 'manager', status: 'online', department: 'Operations', avatar: 'https://ui-avatars.com/api/?background=c3a26c&color=fff&name=Lan+Pham' },
  { id: 'student-2', name: 'Hai Anh Nguyen', email: 'haianh@student.edu', role: 'student', status: 'online', studentId: 'STU2024002', department: 'Business', avatar: 'https://ui-avatars.com/api/?background=6b7280&color=fff&name=Hai+Anh' },
  { id: 'student-3', name: 'Minh Quan Tran', email: 'quan.tran@student.edu', role: 'student', status: 'offline', studentId: 'STU2024003', department: 'Engineering', avatar: 'https://ui-avatars.com/api/?background=6b7280&color=fff&name=Minh+Quan', lastSeen: '2024-01-15T10:30:00' },
  { id: 'student-4', name: 'Thuc Linh Pham', email: 'linh.pham@student.edu', role: 'student', status: 'away', studentId: 'STU2024004', department: 'Psychology', avatar: 'https://ui-avatars.com/api/?background=6b7280&color=fff&name=Thuc+Linh' },
  { id: 'club-1', name: 'Football Club', email: 'football@dormly.com', role: 'student', status: 'online', department: 'Sports Club', avatar: 'https://ui-avatars.com/api/?background=9d7443&color=fff&name=Football+Club' },
];

const generateMessages = (convId: string, count: number): Message[] => {
  const messages: Message[] = [];
  const now = new Date();
  const messageContents = [
    'Hello, I have a question about my room.',
    'When will the maintenance be completed?',
    'The air conditioner in my room is not working.',
    'I need to request a room transfer.',
    'Please check the water supply issue.',
    'The common area lights are broken.',
    'Is there any schedule for power outage this week?',
    'My roommate is moving out next month.',
    'Can I extend my contract?',
    'The wifi connection is unstable in room 304.',
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

const officeParticipant = userToParticipant(allUsers[1]);
const managerParticipant = userToParticipant(allUsers[2]);
const student2Participant = userToParticipant(allUsers[3]);
const student3Participant = userToParticipant(allUsers[4]);
const student4Participant = userToParticipant(allUsers[5]);
const clubParticipant = userToParticipant(allUsers[6]);
const currentUserParticipant = userToParticipant(currentUser);

export const conversations: Conversation[] = [
  {
    id: 'conv-1',
    type: 'direct',
    name: 'Residence Office',
    avatar: allUsers[1].avatar,
    participants: [officeParticipant, currentUserParticipant],
    lastMessage: {
      id: 'last-1',
      content: 'Your document has been approved.',
      senderId: 'office-1',
      senderName: 'Residence Office',
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
    name: 'Ms. Lan Pham',
    avatar: allUsers[2].avatar,
    participants: [managerParticipant, currentUserParticipant],
    lastMessage: {
      id: 'last-2',
      content: 'Your transfer request is being processed.',
      senderId: 'manager-1',
      senderName: 'Ms. Lan Pham',
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
    name: 'Hai Anh Nguyen',
    avatar: allUsers[3].avatar,
    participants: [student2Participant, currentUserParticipant],
    lastMessage: {
      id: 'last-3',
      content: 'See you at the football match!',
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
    name: 'Room A304 Group',
    participants: [student2Participant, student3Participant, student4Participant, currentUserParticipant],
    lastMessage: {
      id: 'last-4',
      content: 'Anyone wants to join dinner tonight?',
      senderId: 'student-2',
      senderName: 'Hai Anh Nguyen',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      type: 'text',
      isRead: false,
    },
    unreadCount: 3,
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'conv-5',
    type: 'group',
    name: 'Football Club',
    avatar: allUsers[6].avatar,
    participants: [clubParticipant, student2Participant, currentUserParticipant],
    lastMessage: {
      id: 'last-5',
      content: 'Practice at 4 PM today at the field',
      senderId: 'club-1',
      senderName: 'Football Club',
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
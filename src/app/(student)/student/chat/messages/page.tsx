// // app/(student)/chat/messages/page.tsx
// 'use client';

// import { ChatTabs } from '../_components/chat-tabs';
// import { ChatInterface } from '../_components/chat-interface';

// export default function MessagesPage() {
//   return (
//     <div className="space-y-6 pb-24 lg:pb-4">
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
//         <div>
//           <p className="text-xs font-medium uppercase tracking-[0.24em] text-stone-500">
//             Communication
//           </p>
//           <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[#28231f] sm:text-5xl">
//             Messages
//           </h1>
//           <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">
//             Chat with residence office, managers, and roommates
//           </p>
//         </div>
//         <ChatTabs />
//       </div>

//       <ChatInterface />
//     </div>
//   );
// }
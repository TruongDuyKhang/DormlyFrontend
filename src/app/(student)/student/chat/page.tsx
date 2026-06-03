// app/(student)/chat/page.tsx
import { redirect } from "next/navigation";

export default function ChatPage() {
  redirect("/student/chat/messages");
}
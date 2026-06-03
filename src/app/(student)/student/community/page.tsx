// app/(student)/community/page.tsx
import { redirect } from "next/navigation";

export default function CommunityPage() {
  redirect("/student/community/feed");
}
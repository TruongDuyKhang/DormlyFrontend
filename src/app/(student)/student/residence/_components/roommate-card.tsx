import { GraduationCap } from "lucide-react";

interface RoommateCardProps {
  name: string;
  faculty: string;
  initials: string;
  tone: string;
}

export function RoommateCard({
  name,
  faculty,
  initials,
  tone,
}: RoommateCardProps) {
  return (
    <article className="rounded-[1.45rem] border border-white/60 bg-white/42 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:bg-white/58">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${tone} text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]`}
        >
          {initials}
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-stone-900">
            {name}
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-stone-500">
            <GraduationCap className="h-3.5 w-3.5" />
            {faculty}
          </p>
        </div>
      </div>
    </article>
  );
}

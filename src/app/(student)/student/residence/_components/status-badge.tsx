import { cn } from "@/lib/utils";

const badgeTone = {
  verified: "bg-emerald-950/90 text-emerald-100",
  pending: "bg-[#8f6b3d] text-white",
  rejected: "bg-rose-950/90 text-rose-100",
  neutral: "bg-[#2f2a24] text-[#d6bd8a]",
};

type BadgeTone = keyof typeof badgeTone;

export function StatusBadge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-7 shrink-0 items-center rounded-full px-3 text-xs font-medium",
        badgeTone[tone]
      )}
    >
      {children}
    </span>
  );
}

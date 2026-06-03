import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

type FooterProps = {
  variant?: "light" | "dark";
};

export function Footer({ variant = "light" }: FooterProps) {
  const isDark = variant === "dark";

  return (
    <footer
      className={cn(
        "border-t",
        isDark
          ? "border-white/10 bg-stone-950 text-stone-400"
          : "border-stone-200/80 bg-[#faf8f5] text-stone-500"
      )}
    >
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-4 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
        <div className="flex items-center gap-4">
          <Image
            src={isDark ? "/logo_white.png" : "/logo_black.png"}
            alt="Dormly"
            width={100}
            height={22}
            className="h-5 w-auto opacity-80"
          />
          <p className="text-xs">
            Premium residence operations for modern campuses.
          </p>
        </div>
        <div className="flex gap-6 text-xs">
          <Link href="/login" className={cn("transition-colors", isDark ? "hover:text-white" : "hover:text-stone-900")}>
            Sign in
          </Link>
          <Link href="/register" className={cn("transition-colors", isDark ? "hover:text-white" : "hover:text-stone-900")}>
            Request access
          </Link>
          <Link href="#" className={cn("transition-colors", isDark ? "hover:text-white" : "hover:text-stone-900")}>
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}

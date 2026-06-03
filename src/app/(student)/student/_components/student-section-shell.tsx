 import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

interface SectionItem {
  title: string;
  description: string;
  meta?: string;
}

interface StudentSectionShellProps {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  actionLabel: string;
  actionHref: string;
  items: SectionItem[];
}

export function StudentSectionShell({
  eyebrow,
  title,
  description,
  icon: Icon,
  actionLabel,
  actionHref,
  items,
}: StudentSectionShellProps) {
  return (
    <section className="pb-24 lg:pb-4">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-[#e9dfd0] p-5 shadow-[0_34px_90px_-60px_rgba(38,35,31,0.78)] sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(255,255,255,0.84),transparent_28%),linear-gradient(125deg,rgba(255,255,255,0.42),rgba(162,138,104,0.2))]" />
        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(20rem,0.45fr)]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/65 bg-white/36 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-stone-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)] backdrop-blur-xl">
              <Icon className="h-3.5 w-3.5 text-[#9d7443]" />
              {eyebrow}
            </div>
            <h1 className="mt-7 max-w-4xl text-4xl font-semibold leading-[1.04] tracking-tight text-[#28231f] sm:text-5xl">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-stone-600 sm:text-lg">
              {description}
            </p>
            <Link
              href={actionHref}
              className="mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-[#2f2a24] px-5 text-sm font-medium text-stone-50 transition hover:bg-[#40382f] active:scale-[0.98]"
            >
              {actionLabel}
              <ArrowRight className="h-4 w-4 text-[#d6bd8a]" />
            </Link>
          </div>

          <div className="rounded-[1.75rem] border border-white/55 bg-white/38 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)] backdrop-blur-xl sm:p-6">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-stone-500">
              Personal context
            </p>
            <div className="mt-5 space-y-3">
              {items.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[1.25rem] border border-stone-200/70 bg-[#f8f4ee]/72 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-semibold text-stone-900">
                        {item.title}
                      </h2>
                      <p className="mt-1 text-sm leading-6 text-stone-600">
                        {item.description}
                      </p>
                    </div>
                    {item.meta && (
                      <span className="shrink-0 rounded-full bg-[#2f2a24] px-3 py-1 text-xs font-medium text-[#d6bd8a]">
                        {item.meta}
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
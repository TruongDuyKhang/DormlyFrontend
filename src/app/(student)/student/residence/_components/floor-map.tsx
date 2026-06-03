import { cn } from "@/lib/utils";

const rooms = ["A301", "A302", "A303", "A304", "A305", "A306"];

export function FloorMap() {
  return (
    <div className="rounded-[1.5rem] border border-stone-200/70 bg-[#f8f4ee]/76 p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-stone-500">
            Mini floor map
          </p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight text-stone-900">
            Block A, Floor 3
          </h3>
        </div>
        <span className="rounded-full bg-[#2f2a24] px-3 py-1 text-xs font-medium text-[#d6bd8a]">
          A304
        </span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {rooms.map((room) => {
          const active = room === "A304";

          return (
            <div
              key={room}
              className={cn(
                "flex h-16 items-center justify-center rounded-2xl border text-sm font-semibold transition",
                active
                  ? "border-[#2f2a24] bg-[#2f2a24] text-[#d6bd8a] shadow-[0_18px_38px_-26px_rgba(47,42,36,0.9)]"
                  : "border-stone-200 bg-white/54 text-stone-500"
              )}
            >
              {room}
            </div>
          );
        })}
      </div>
    </div>
  );
}

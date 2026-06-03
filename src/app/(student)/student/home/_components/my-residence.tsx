// app/(student)/home/_components/my-residence.tsx
"use client";

import { Users } from "lucide-react";
import { motion } from "framer-motion";

interface Roommate {
  name: string;
  avatar: string;
}

interface MyResidenceProps {
  roommates: Roommate[];
}

export function MyResidence({ roommates }: MyResidenceProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex flex-col rounded-[1.75rem] border border-white/55 bg-[#2d2822]/88 p-5 text-stone-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-2xl sm:p-6"
    >
      <div>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-stone-400">
              My Residence
            </p>
            <h2 className="mt-2 text-5xl font-semibold tracking-tight">
              A304
            </h2>
            <div className="mt-2 flex gap-2">
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm">
                Block A
              </span>
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm">
                Floor 3
              </span>
            </div>
          </div>
          <div className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-sm text-[#d6bd8a]">
            Active
          </div>
        </div>

        {/* Roommates Section */}
        <div className="mt-6">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-[#d6bd8a]" />
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-stone-400">
              Roommates • {roommates.length} people
            </p>
          </div>
          <div className="mt-3 flex flex-wrap gap-4">
            {roommates.map((roommate) => (
              <div key={roommate.name} className="flex flex-col items-center gap-1">
                <img
                  src={roommate.avatar}
                  alt={roommate.name}
                  className="h-10 w-10 rounded-full border border-white/20"
                />
                <span className="text-sm font-medium text-stone-300">{roommate.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
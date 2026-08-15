// app/(student)/home/_components/my-residence.tsx
"use client";

import { Users, Info } from "lucide-react";
import { motion } from "framer-motion";

interface Roommate {
  name: string;
  avatar: string;
}

interface MyResidenceProps {
  roomNumber: string;
  floorLevel: string;
  blockName: string;
  roommates: Roommate[];
  isAssigned: boolean;
}

export function MyResidence({ 
  roomNumber, 
  floorLevel, 
  blockName, 
  roommates, 
  isAssigned 
}: MyResidenceProps) {
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
              Ký túc xá của tôi
            </p>
            <h2 className="mt-2 text-4xl font-semibold tracking-tight">
              {isAssigned ? `Phòng ${roomNumber}` : 'Chưa xếp phòng'}
            </h2>
            {isAssigned ? (
              <div className="mt-2 flex gap-2">
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs">
                  {blockName}
                </span>
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs">
                  Tầng {floorLevel}
                </span>
              </div>
            ) : (
              <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-200">
                <Info className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                <span>Hồ sơ xếp phòng của bạn đang được xử lý. Thông tin phòng ở sẽ xuất hiện sau khi quản trị viên phê duyệt.</span>
              </div>
            )}
          </div>
          <div className={`rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wider ${
            isAssigned 
              ? "border-[#d6bd8a]/30 bg-[#d6bd8a]/10 text-[#d6bd8a]" 
              : "border-stone-500/30 bg-stone-500/10 text-stone-400"
          }`}>
            {isAssigned ? 'Active' : 'Pending'}
          </div>
        </div>

        {/* Roommates Section */}
        {isAssigned && (
          <div className="mt-6">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-[#d6bd8a]" />
              <p className="text-sm font-medium uppercase tracking-[0.22em] text-stone-400">
                Bạn cùng phòng • {roommates.length} thành viên
              </p>
            </div>
            {roommates.length === 0 ? (
              <p className="text-xs text-stone-400 mt-2">Chưa có bạn cùng phòng nào được xếp cùng phòng này.</p>
            ) : (
              <div className="mt-3 flex flex-wrap gap-4">
                {roommates.map((roommate, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <img
                      src={roommate.avatar}
                      alt={roommate.name}
                      className="h-10 w-10 rounded-full border border-white/20"
                    />
                    <span className="text-xs font-medium text-stone-300 max-w-[64px] truncate" title={roommate.name}>
                      {roommate.name.split(' ').pop()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
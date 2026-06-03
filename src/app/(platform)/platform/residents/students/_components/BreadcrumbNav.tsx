// app/(platform)/residents/students/_components/BreadcrumbNav.tsx
'use client';

import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Block, Floor, Room } from './types';

interface BreadcrumbNavProps {
  currentView: 'blocks' | 'floors' | 'rooms' | 'students';
  selectedBlock: Block | null;
  selectedFloor: Floor | null;
  selectedRoom: Room | null;
  onReset: () => void;
  onBackToFloors: () => void;
  onBackToRooms: () => void;
}

export function BreadcrumbNav({
  currentView,
  selectedBlock,
  selectedFloor,
  selectedRoom,
  onReset,
  onBackToFloors,
  onBackToRooms,
}: BreadcrumbNavProps) {
  if (currentView === 'blocks') return null;

  return (
    <div className="mb-6 flex items-center gap-2 text-sm">
      <button onClick={onReset} className="text-stone-500 hover:text-stone-700 transition">
        All Blocks
      </button>
      {selectedBlock && (
        <>
          <ChevronRight className="h-3 w-3 text-stone-400" />
          <button
            onClick={onBackToFloors}
            className={cn(
              "transition-colors",
              currentView === 'floors' ? 'text-stone-950 font-medium' : 'text-stone-500 hover:text-stone-700'
            )}
          >
            {selectedBlock.name}
          </button>
        </>
      )}
      {selectedFloor && (
        <>
          <ChevronRight className="h-3 w-3 text-stone-400" />
          <button
            onClick={onBackToRooms}
            className={cn(
              "transition-colors",
              currentView === 'rooms' ? 'text-stone-950 font-medium' : 'text-stone-500 hover:text-stone-700'
            )}
          >
            Floor {selectedFloor.level}
          </button>
        </>
      )}
      {selectedRoom && (
        <>
          <ChevronRight className="h-3 w-3 text-stone-400" />
          <span className="text-stone-950 font-medium">Room {selectedRoom.number}</span>
        </>
      )}
    </div>
  );
}
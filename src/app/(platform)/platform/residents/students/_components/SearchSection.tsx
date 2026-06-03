// app/(platform)/residents/students/_components/SearchSection.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, User, ChevronRight } from 'lucide-react';
import { Input } from '@/_components/ui/input';
import { SearchResult } from './types';

interface SearchSectionProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSearch: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onClear: () => void;
  isSearching: boolean;
  showResults: boolean;
  searchResults: SearchResult[];
  onResultClick: (result: SearchResult) => void;
}

export function SearchSection({
  searchQuery,
  onSearchQueryChange,
  onSearch,
  onKeyPress,
  onClear,
  isSearching,
  showResults,
  searchResults,
  onResultClick,
}: SearchSectionProps) {
  return (
    <div className="flex gap-2 w-full lg:w-auto">
      <div className="relative flex-1 lg:w-64">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
        <Input
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder="Search by name or ID"
          className="h-11 rounded-full border-white/55 bg-white/34 pl-9 pr-4 text-sm text-stone-700 placeholder:text-stone-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] focus-visible:ring-stone-500/30"
        />
        {searchQuery && (
          <button
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <AnimatePresence>
          {showResults && searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute top-full left-0 right-0 mt-2 z-20 max-h-80 overflow-y-auto rounded-2xl border border-white/60 bg-[#f3eee6]/98 shadow-2xl backdrop-blur-xl"
            >
              {searchResults.map((result) => (
                <button
                  key={result.student.id}
                  onClick={() => onResultClick(result)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-white/40 first:rounded-t-2xl last:rounded-b-2xl"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c3a26c]/20">
                    <User className="h-4 w-4 text-[#c3a26c]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-stone-950">{result.student.name}</p>
                    <p className="text-xs text-stone-500">
                      {result.blockName} • Floor {result.floorLevel} • Room {result.roomNumber}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-stone-400" />
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onSearch}
        disabled={isSearching}
        className="h-11 px-5 rounded-full bg-[#c3a26c] text-white font-medium text-sm shadow-sm hover:bg-[#b08f5a] transition flex items-center gap-2"
      >
        <Search className="h-4 w-4" />
        Search
      </motion.button>
    </div>
  );
}
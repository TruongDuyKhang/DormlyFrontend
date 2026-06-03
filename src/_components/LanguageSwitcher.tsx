// components/language-switcher.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Language {
  code: string;
  name: string;
  flag: string;
}

// Chỉ giữ 2 ngôn ngữ: English và Tiếng Việt
const languages: Language[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
];

interface LanguageSwitcherProps {
  variant?: "sidebar" | "header" | "compact";
  onLanguageChange?: (langCode: string) => void;
}

export function LanguageSwitcher({ variant = "sidebar", onLanguageChange }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load saved language from localStorage after mount
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("dormly_language");
    if (saved) {
      const found = languages.find(l => l.code === saved);
      if (found) setCurrentLanguage(found);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setCurrentLanguage(lang);
    localStorage.setItem("dormly_language", lang.code);
    setIsOpen(false);
    onLanguageChange?.(lang.code);
    
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("language-change", { detail: { code: lang.code } }));
    }
  };

  // Don't render until mounted (avoid hydration mismatch)
  if (!mounted) {
    // Return placeholder with same dimensions
    if (variant === "sidebar") {
      return <div className="min-h-11 w-full" />;
    }
    if (variant === "header") {
      return <div className="h-9 w-24 rounded-full bg-white/20" />;
    }
    return <div className="h-11 w-11" />;
  }

  // Sidebar variant (dùng trong sidebar platform)
  if (variant === "sidebar") {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex min-h-11 w-full items-center gap-3 rounded-2xl px-3 text-sm text-stone-400 transition hover:bg-white/7 hover:text-stone-100 active:scale-[0.98]"
          )}
        >
          <Globe className="h-4.5 w-4.5" />
          <span className="flex-1 text-left">Language</span>
          <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
        </button>

        {isOpen && (
          <div className="absolute bottom-full left-0 mb-2 w-full rounded-xl border border-white/20 bg-[#2b2722] shadow-lg overflow-hidden z-50">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang)}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2 text-sm transition hover:bg-white/10",
                  currentLanguage.code === lang.code && "text-[#d2b47c]"
                )}
              >
                <span className="text-base">{lang.flag}</span>
                <span className="flex-1 text-left">{lang.name}</span>
                {currentLanguage.code === lang.code && <Check className="h-4 w-4" />}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Header variant (dùng trong header của student)
  if (variant === "header") {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 rounded-full border border-stone-300 bg-white/60 px-3 py-1.5 text-sm font-medium text-stone-700 transition hover:bg-white/80 shadow-sm"
        >
          <Globe className="h-4 w-4 text-stone-500" />
          <span>{currentLanguage.name}</span>
          <ChevronDown className={cn("h-3.5 w-3.5 text-stone-500 transition-transform", isOpen && "rotate-180")} />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-36 rounded-xl border border-stone-200 bg-white shadow-lg overflow-hidden z-50">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang)}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2 text-sm transition hover:bg-stone-50",
                  currentLanguage.code === lang.code && "text-[#9d7443]"
                )}
              >
                <span className="text-base">{lang.flag}</span>
                <span className="flex-1 text-left">{lang.name}</span>
                {currentLanguage.code === lang.code && <Check className="h-4 w-4" />}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Compact variant (dùng khi collapsed sidebar)
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-11 w-11 items-center justify-center rounded-2xl text-stone-400 transition hover:bg-white/7 hover:text-stone-100"
      >
        <Globe className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-36 rounded-xl border border-white/20 bg-[#2b2722] shadow-lg overflow-hidden z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang)}
              className={cn(
                "flex w-full items-center gap-2 px-3 py-2 text-sm transition hover:bg-white/10",
                currentLanguage.code === lang.code && "text-[#d2b47c]"
              )}
            >
              <span className="text-base">{lang.flag}</span>
              <span className="flex-1 text-left">{lang.name}</span>
              {currentLanguage.code === lang.code && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
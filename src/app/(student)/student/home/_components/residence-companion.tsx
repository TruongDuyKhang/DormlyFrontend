// app/(student)/home/_components/residence-companion.tsx
"use client";

import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Cloud, CloudRain, Sun, Moon, Droplets, Wind, CloudRain as RainIcon } from "lucide-react";
import type { WeatherData } from "./types";
import { useAuth } from "@/app/(auth)/context/auth-context";

interface ResidenceCompanionProps {
  weather: WeatherData | null;
}

const getWeatherIcon = (condition: string, isDay: boolean) => {
  const normalized = condition.toLowerCase();
  if (!isDay) return <Moon className="h-8 w-8 text-amber-200" />;
  if (normalized.includes("rain") || normalized.includes("drizzle")) return <CloudRain className="h-8 w-8 text-sky-200" />;
  if (normalized.includes("cloud")) return <Cloud className="h-8 w-8 text-stone-200" />;
  return <Sun className="h-8 w-8 text-yellow-300" />;
};

export function ResidenceCompanion({ weather }: ResidenceCompanionProps) {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
  
  // Lấy tên gọi (tên cuối cùng trong họ tên)
  const userName = user?.fullname ? user.fullname.trim().split(' ').pop() || user.fullname : "Resident";
  const isDay = hour >= 6 && hour < 18;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-white/65 bg-white/36 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-stone-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)] backdrop-blur-xl">
        <Sparkles className="h-3.5 w-3.5 text-[#9d7443]" />
        Residence Companion
      </div>

      <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.03] tracking-tight text-[#28231f] sm:text-5xl lg:text-6xl">
        Good {greeting}, {userName}.
      </h1>

      {/* Weather Info - Không khung, ghi thẳng */}
      {weather && (
        <div className="mt-4 flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            {getWeatherIcon(weather.condition, isDay)}
            <span className="text-5xl font-semibold tracking-tight text-stone-800">
              {weather.temperature}°
            </span>
          </div>
          <div className="h-8 w-px bg-stone-300/50" />
          <div>
            <p className="text-lg font-medium text-stone-700">{weather.condition}</p>
          </div>
          <div className="h-8 w-px bg-stone-300/50" />
          <div className="flex gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-stone-500">Humidity</p>
              <p className="text-base font-semibold text-stone-700">{weather.humidity}%</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-stone-500">Rain</p>
              <p className="text-base font-semibold text-stone-700">{weather.rainChance}%</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-stone-500">City</p>
              <p className="text-base font-semibold text-stone-700">{weather.city}</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
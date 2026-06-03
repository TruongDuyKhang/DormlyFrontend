// app/(student)/home/page.tsx
"use client";

import { useEffect, useState } from "react";
import { WeatherBackground } from "./_components/weather-background";
import { ResidenceCompanion } from "./_components/residence-companion";
import { QuickActions } from "./_components/quick-actions";
import { CommunityHighlights } from "./_components/community-highlights";
import { RequestUpdates } from "./_components/request-updates";
import { UpcomingEvents } from "./_components/upcoming-events";
import { MyResidence } from "./_components/my-residence";
import type { WeatherData } from "./_components/types";

// Roommate data
const roommates = [
  { name: "Minh", avatar: "https://ui-avatars.com/api/?name=Minh&background=9d7443&color=fff&bold=true&size=40" },
  { name: "Lan", avatar: "https://ui-avatars.com/api/?name=Lan&background=9d7443&color=fff&bold=true&size=40" },
  { name: "Tú", avatar: "https://ui-avatars.com/api/?name=Tu&background=9d7443&color=fff&bold=true&size=40" },
  { name: "An", avatar: "https://ui-avatars.com/api/?name=An&background=9d7443&color=fff&bold=true&size=40" },
];

export default function StudentHomePage() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=Ho%20Chi%20Minh%20City&count=1&language=en&format=json`
        );
        const geoData = await geoRes.json();

        if (geoData.results?.[0]) {
          const { latitude, longitude } = geoData.results[0];
          const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,precipitation_probability&timezone=auto`
          );
          const weatherData = await weatherRes.json();

          const weatherCodes: Record<number, string> = {
            0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
            45: "Foggy", 51: "Light drizzle", 53: "Moderate drizzle", 55: "Dense drizzle",
            61: "Light rain", 63: "Moderate rain", 65: "Heavy rain",
            71: "Light snow", 73: "Moderate snow", 75: "Heavy snow",
            80: "Light rain showers", 81: "Moderate rain showers", 82: "Violent rain showers",
            95: "Thunderstorm", 96: "Thunderstorm with hail",
          };

          setWeather({
            temperature: Math.round(weatherData.current.temperature_2m),
            condition: weatherCodes[weatherData.current.weather_code] || "Clear sky",
            humidity: weatherData.current.relative_humidity_2m,
            rainChance: weatherData.current.precipitation_probability || 0,
            aqi: 42,
            city: geoData.results[0].name,
            country: geoData.results[0].country,
          });
        }
      } catch (error) {
        console.error("Failed to fetch weather:", error);
        setWeather({
          temperature: 27,
          condition: "Overcast",
          humidity: 89,
          rainChance: 4,
          aqi: 42,
          city: "Ho Chi Minh City",
          country: "VN",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-12 w-12 animate-pulse rounded-full bg-stone-400/30" />
      </div>
    );
  }

  return (
    <>
      {/* Weather Background - Phiên bản mới không cần condition/isDay */}
      <WeatherBackground />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10 }} className="pb-24 lg:pb-4">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-[#e9dfd0]/70 shadow-[0_34px_90px_-60px_rgba(38,35,31,0.78)] backdrop-blur-sm">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(255,255,255,0.84),transparent_26%),linear-gradient(115deg,rgba(245,239,230,0.96)_0%,rgba(235,224,208,0.86)_44%,rgba(109,92,70,0.48)_100%)]" />
          <div className="relative grid gap-8 p-5 sm:p-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(21rem,0.72fr)] lg:p-10">
            <div className="flex flex-col justify-between gap-6">
              <ResidenceCompanion weather={weather} />
              <QuickActions />
            </div>

            {/* My Residence Component */}
            <MyResidence roommates={roommates} />
          </div>
        </section>

        {/* Grid 2 cột - Tỉ lệ 6:4 (lg:grid-cols-3) */}
        <section className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Cột trái - Community Highlights (chiếm 2/3 ≈ 6 phần) */}
          <div className="lg:col-span-2">
            <CommunityHighlights />
          </div>

          {/* Cột phải - Request Updates + Upcoming Events (chiếm 1/3 ≈ 4 phần) */}
          <aside className="space-y-6">
            <RequestUpdates />
            <UpcomingEvents />
          </aside>
        </section>
      </div>
    </>
  );
}
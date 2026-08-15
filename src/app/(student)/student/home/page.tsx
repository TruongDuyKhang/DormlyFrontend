// app/(student)/student/home/page.tsx
"use client";

import { useEffect, useState } from "react";
import { WeatherBackground } from "./_components/weather-background";
import { ResidenceCompanion } from "./_components/residence-companion";
import { QuickActions } from "./_components/quick-actions";
import { CommunityHighlights } from "./_components/community-highlights";
import { RequestUpdates } from "./_components/request-updates";
import { MyResidence } from "./_components/my-residence";
import type { WeatherData } from "./_components/types";
import { roomAssignmentService } from "@/services/roomAssignmentService";
import { buildingService } from "@/services/buildingService";
import { userService } from "@/services/userService";

export default function StudentHomePage() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  // Residence info states
  const [residenceInfo, setResidenceInfo] = useState<{
    roomNumber: string;
    floorLevel: string;
    blockName: string;
    roommates: { name: string; avatar: string }[];
    isAssigned: boolean;
  }>({
    roomNumber: "Chưa xếp phòng",
    floorLevel: "N/A",
    blockName: "Chưa gán",
    roommates: [],
    isAssigned: false,
  });

  useEffect(() => {
    const fetchWeatherAndResidence = async () => {
      // 1. Fetch Weather
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
      }

      // 2. Fetch Live Residence Info
      try {
        const currentAsg = await roomAssignmentService.getCurrentRoom();
        if (currentAsg && currentAsg.roomNodeId) {
          const [allNodes, allAssignments, allUsers] = await Promise.all([
            buildingService.listNodes(),
            roomAssignmentService.list(),
            userService.list(),
          ]);

          const nodeMap = new Map(allNodes.map((n) => [n.id, n]));
          const userMap = new Map(allUsers.map((u) => [u.id, u]));

          // Resolve room hierarchy details
          const roomNode = nodeMap.get(currentAsg.roomNodeId);
          const roomNumber = roomNode?.name || "N/A";
          let floorLevel = "N/A";
          let blockName = "N/A";

          if (roomNode?.parentId) {
            const floorNode = nodeMap.get(roomNode.parentId);
            floorLevel = floorNode?.name?.replace(/\D/g, '') || "1";
            if (floorNode?.parentId) {
              const blockNode = nodeMap.get(floorNode.parentId);
              blockName = blockNode?.name || "Tòa nhà";
            }
          }

          // Resolve roommates
          const roomOccupants = allAssignments.filter(
            (asg) => asg.roomNodeId === currentAsg.roomNodeId
          );

          const mates = roomOccupants
            .map((asg) => {
              const u = userMap.get(asg.userId);
              if (!u) return null;
              return {
                name: u.fullName || "Bạn cùng phòng",
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  u.fullName || "RM"
                )}&background=9d7443&color=fff&bold=true&size=40`,
              };
            })
            .filter(Boolean) as { name: string; avatar: string }[];

          setResidenceInfo({
            roomNumber,
            floorLevel,
            blockName,
            roommates: mates,
            isAssigned: true,
          });
        }
      } catch (err) {
        console.warn("Student room assignment is empty or failed to load:", err);
        setResidenceInfo({
          roomNumber: "Chưa xếp phòng",
          floorLevel: "N/A",
          blockName: "Chưa gán",
          roommates: [],
          isAssigned: false,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherAndResidence();
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
      {/* Weather Background */}
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
            <MyResidence 
              roomNumber={residenceInfo.roomNumber}
              floorLevel={residenceInfo.floorLevel}
              blockName={residenceInfo.blockName}
              roommates={residenceInfo.roommates}
              isAssigned={residenceInfo.isAssigned}
            />
          </div>
        </section>

        {/* Grid 2 columns */}
        <section className="mt-6">
          <RequestUpdates />
        </section>
      </div>
    </>
  );
}
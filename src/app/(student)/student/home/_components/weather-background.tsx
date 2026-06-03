// app/(student)/home/_components/weather-background.tsx
"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WeatherState {
  condition: string;
  isDay: boolean;
  temperature: number;
  windSpeed: number;
  humidity: number;
  feelsLike: number;
  visibility: number;
  pressure: number;
  uvIndex: number;
}

interface WeatherBackgroundProps {
  onWeatherUpdate?: (weather: WeatherState) => void;
  enableAutoWeather?: boolean;
}

// ============== TIME UTILITIES ==============
const calculateSunTimes = (latitude: number = 10.7769, longitude: number = 106.7009) => {
  // Default: Ho Chi Minh City coordinates
  const now = new Date();
  const J2000 = 2451545.0;
  const JD = now.getTime() / 86400000 + 2440587.5;
  const n = JD - J2000 - 0.0009;
  const J = n + 0.0027379 * Math.sin((102.9372 + 12.36875 * n) * (Math.PI / 180));
  const M = (100.4646 + 0.98564724 * n) % 360;
  const C = (1.914602 - 0.004817 * Math.sin(M * (Math.PI / 180)) - 0.000014 * Math.sin(2 * M * (Math.PI / 180))) *
    Math.sin(M * (Math.PI / 180)) +
    (0.019993 - 0.000101 * Math.sin(M * (Math.PI / 180))) * Math.sin(2 * M * (Math.PI / 180)) +
    0.000029 * Math.sin(3 * M * (Math.PI / 180));
  const sunLon = (M + C + 102.9372) % 360;
  const sunLat = Math.asin(Math.sin(sunLon * (Math.PI / 180)) * Math.sin(23.43929 * (Math.PI / 180))) * (180 / Math.PI);
  const H = Math.acos(
    -Math.tan(latitude * (Math.PI / 180)) * Math.tan(sunLat * (Math.PI / 180))
  ) * (180 / Math.PI);
  const sunrise = 12 - H / 15;
  const sunset = 12 + H / 15;

  return { sunrise, sunset };
};

const isDaytime = (): boolean => {
  const now = new Date();
  const hours = now.getHours();
  const { sunrise, sunset } = calculateSunTimes();

  return hours >= Math.ceil(sunrise) && hours < Math.floor(sunset);
};

// ============== PARTICLE COMPONENTS ==============

const SunnyBackground = ({ temperature = 25 }: { temperature?: number }) => {
  const isBright = temperature > 30;

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className={`absolute inset-0 bg-gradient-to-b ${
          isBright ? "from-sky-300 via-sky-300 to-amber-100" : "from-sky-500 via-sky-400 to-amber-200"
        }`}
      />

      <motion.div
        className="absolute top-12 right-12 h-56 w-56 rounded-full bg-yellow-300/50 blur-3xl"
        animate={{ opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <motion.div
        className="absolute top-16 left-[-15%] flex gap-10"
        animate={{ x: ["0%", "130%"] }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
      >
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-full bg-white/30 blur-2xl"
            style={{ height: `${64 + i * 8}px`, width: `${128 + i * 16}px` }}
          />
        ))}
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-amber-100/40 via-transparent to-transparent" />
    </div>
  );
};

const CloudyBackground = ({ windSpeed = 0.2, cloudCover = 0.7 }: { windSpeed?: number; cloudCover?: number }) => {
  const cloudCount = Math.floor(8 * cloudCover);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-400 via-slate-300 to-slate-200" />

      {Array.from({ length: cloudCount }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ top: `${(i * 100) / cloudCount}%` }}
          animate={{ x: ["0%", "200%"] }}
          transition={{
            duration: 60 + Math.random() * 40,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div className="flex gap-6 opacity-70 filter blur-lg">
            <div className="h-24 w-48 rounded-full bg-white/60" />
            <div className="h-32 w-56 rounded-full bg-white/50" />
            <div className="h-20 w-40 rounded-full bg-white/40" />
          </div>
        </motion.div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-600/10 to-slate-700/20 pointer-events-none" />
    </div>
  );
};

const RainyBackground = ({ windSpeed = 0, intensity = 1 }: { windSpeed?: number; intensity?: number }) => {
  const rainCount = Math.floor(250 * intensity);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-700 via-slate-600 to-slate-500" />

      {Array.from({ length: rainCount }).map((_, i) => {
        const randomX = Math.random() * 100;
        const randomDelay = Math.random() * 2;
        const duration = 0.6 + Math.random() * 0.4;
        const windOffset = windSpeed * 30;

        return (
          <motion.div
            key={i}
            className="absolute w-px h-6 bg-gradient-to-b from-white/60 to-white/10"
            style={{
              left: `${randomX}%`,
              top: "-10px",
              boxShadow: "0 0 1px rgba(255,255,255,0.5)",
            }}
            animate={{
              y: ["0vh", "110vh"],
              x: [0, windOffset],
              opacity: [0.7, 0],
            }}
            transition={{
              y: { duration, repeat: Infinity, ease: "linear", delay: randomDelay },
              x: { duration, repeat: Infinity, ease: "linear", delay: randomDelay },
              opacity: { duration, repeat: Infinity, ease: "easeOut", delay: randomDelay },
            }}
          />
        );
      })}

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/10 pointer-events-none" />
    </div>
  );
};

const DrizzleBackground = ({ windSpeed = 0.2 }: { windSpeed?: number }) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-500 via-slate-400 to-slate-300" />

      {Array.from({ length: 100 }).map((_, i) => {
        const randomX = Math.random() * 100;
        const randomDelay = Math.random() * 1.5;
        const duration = 1.5 + Math.random() * 0.5;

        return (
          <motion.div
            key={i}
            className="absolute w-px h-3 bg-white/40"
            style={{
              left: `${randomX}%`,
              top: "-10px",
            }}
            animate={{
              y: ["0vh", "110vh"],
              x: [0, windSpeed * 20],
              opacity: [0.5, 0],
            }}
            transition={{
              y: { duration, repeat: Infinity, ease: "linear", delay: randomDelay },
              x: { duration, repeat: Infinity, ease: "linear", delay: randomDelay },
              opacity: { duration, repeat: Infinity, ease: "easeOut", delay: randomDelay },
            }}
          />
        );
      })}

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/3 to-white/8 pointer-events-none" />
    </div>
  );
};

const SnowBackground = ({ windSpeed = 0.3, intensity = 1 }: { windSpeed?: number; intensity?: number }) => {
  const snowCount = Math.floor(150 * intensity);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-300 via-slate-200 to-slate-100" />

      {Array.from({ length: snowCount }).map((_, i) => {
        const randomX = Math.random() * 100;
        const randomDelay = Math.random() * 4;
        const duration = 8 + Math.random() * 4;
        const randomSize = 2 + Math.random() * 4;
        const windOffset = windSpeed * 50;

        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${randomX}%`,
              top: "-20px",
              width: `${randomSize}px`,
              height: `${randomSize}px`,
              filter: "blur(0.5px)",
            }}
            animate={{
              y: ["0vh", "120vh"],
              x: [0, windOffset, windOffset * 0.5, windOffset * 1.2, windOffset],
              opacity: [0, 0.8, 0.6, 0],
            }}
            transition={{
              y: { duration, repeat: Infinity, ease: "linear", delay: randomDelay },
              x: { duration, repeat: Infinity, ease: "easeInOut", delay: randomDelay },
              opacity: { duration, repeat: Infinity, ease: "easeInOut", delay: randomDelay },
            }}
          />
        );
      })}

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/80 via-white/40 to-transparent" />
    </div>
  );
};

const HailBackground = ({ windSpeed = 1.5 }: { windSpeed?: number }) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800 via-slate-700 to-slate-600" />

      {Array.from({ length: 200 }).map((_, i) => {
        const randomX = Math.random() * 100;
        const randomDelay = Math.random() * 1;
        const duration = 0.7 + Math.random() * 0.3;
        const size = 3 + Math.random() * 2;
        const windOffset = windSpeed * 40;

        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white shadow-lg"
            style={{
              left: `${randomX}%`,
              top: "-20px",
              width: `${size}px`,
              height: `${size}px`,
              boxShadow: "0 0 3px rgba(255,255,255,0.8)",
            }}
            animate={{
              y: ["0vh", "110vh"],
              x: [0, windOffset],
              opacity: [0.9, 0],
            }}
            transition={{
              y: { duration, repeat: Infinity, ease: "linear", delay: randomDelay },
              x: { duration, repeat: Infinity, ease: "linear", delay: randomDelay },
              opacity: { duration, repeat: Infinity, ease: "easeOut", delay: randomDelay },
            }}
          />
        );
      })}

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-white/15 pointer-events-none" />
    </div>
  );
};

const StormBackground = () => {
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlash(true);
      setTimeout(() => setFlash(false), 150);
    }, 6000 + Math.random() * 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-slate-700" />

      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.7, 0.2, 0.8, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-white pointer-events-none"
          />
        )}
      </AnimatePresence>

      {Array.from({ length: 300 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-px h-5 bg-white/50"
          style={{
            left: `${Math.random() * 100}%`,
            top: "-20px",
          }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, 30],
            opacity: [0.8, 0],
          }}
          transition={{
            duration: 0.5 + Math.random() * 0.3,
            repeat: Infinity,
            delay: Math.random() * 1.5,
            ease: "linear",
          }}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};

const WindyBackground = ({ windSpeed = 2, baseCondition = "cloudy" }: { windSpeed?: number; baseCondition?: string }) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-500 via-slate-400 to-slate-300" />

      {/* Flying debris */}
      {Array.from({ length: 80 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-white/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
          }}
          animate={{
            x: [0, windSpeed * 100],
            y: [0, (Math.random() - 0.5) * 50],
            opacity: [0.5, 0.2, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Wind streaks */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/10 pointer-events-none" />
    </div>
  );
};

const FoggyBackground = ({ windSpeed = 0.1, visibility = 0.5 }: { windSpeed?: number; visibility?: number }) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-500 via-gray-400 to-gray-300" />

      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/20 blur-3xl"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${200 + Math.random() * 200}px`,
            height: `${150 + Math.random() * 150}px`,
          }}
          animate={{
            x: [0, windSpeed * 80],
            opacity: [0.2 * visibility, 0.4 * visibility, 0.2 * visibility],
          }}
          transition={{
            x: { duration: 20, repeat: Infinity, ease: "linear" },
            opacity: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          }}
        />
      ))}

      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-white/30 via-white/10 to-transparent"
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

const NightBackground = ({ cloudCover = 0.2, temperature = 20 }: { cloudCover?: number; temperature?: number }) => {
  const starCount = Math.floor(200 * (1 - cloudCover));

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800" />

      {Array.from({ length: starCount }).map((_, i) => {
        const x = Math.random() * 100;
        const y = Math.random() * 70;
        const brightness = Math.random() * 0.6 + 0.4;
        const duration = 2 + Math.random() * 3;

        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: "2px",
              height: "2px",
            }}
            animate={{
              opacity: [brightness * 0.3, brightness, brightness * 0.3],
            }}
            transition={{
              duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}

      <motion.div
        className="absolute top-20 right-12 h-40 w-40 rounded-full bg-amber-100/20 blur-3xl"
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="absolute top-20 right-12 h-24 w-24 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 shadow-lg" />

      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-transparent to-purple-900/10 pointer-events-none" />
    </div>
  );
};

const SunsetBackground = ({ temperature = 22 }: { temperature?: number }) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className={`absolute inset-0 bg-gradient-to-b ${
          temperature > 25
            ? "from-orange-400 via-orange-500 to-rose-600"
            : "from-orange-600 via-orange-700 to-rose-700"
        }`}
      />

      <div className="absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-orange-400/30 blur-3xl" />
      <div className="absolute bottom-10 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-yellow-300/40 blur-2xl" />

      <motion.div
        className="absolute top-16 left-[-15%] flex gap-8"
        animate={{ x: ["0%", "120%"] }}
        transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
      >
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-full bg-white/30 blur-xl"
            style={{
              height: `${56 - i * 4}px`,
              width: `${112 - i * 8}px`,
            }}
          />
        ))}
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-rose-500/30 via-orange-400/20 to-transparent" />
    </div>
  );
};

const SunriseBackground = ({ temperature = 18 }: { temperature?: number }) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-orange-300 via-pink-400 to-purple-500" />

      <div className="absolute top-20 left-1/4 h-64 w-64 rounded-full bg-orange-300/40 blur-3xl" />
      <div className="absolute top-40 left-1/3 h-32 w-32 rounded-full bg-yellow-200/50 blur-2xl" />

      <motion.div
        className="absolute top-16 left-[-15%] flex gap-8"
        animate={{ x: ["0%", "120%"] }}
        transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
      >
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-full bg-white/25 blur-xl"
            style={{
              height: `${56 - i * 4}px`,
              width: `${112 - i * 8}px`,
            }}
          />
        ))}
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-purple-500/40 via-pink-400/20 to-transparent" />
    </div>
  );
};

const OvercastBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-500 via-slate-400 to-slate-300" />

      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ top: `${i * 15}%` }}
          animate={{ x: ["0%", "200%"] }}
          transition={{
            duration: 70 + Math.random() * 30,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div className="flex gap-8 opacity-60 filter blur-xl">
            <div className="h-32 w-64 rounded-full bg-gray-600/40" />
            <div className="h-40 w-80 rounded-full bg-gray-700/30" />
            <div className="h-24 w-56 rounded-full bg-gray-600/25" />
          </div>
        </motion.div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-600/10 to-slate-700/20 pointer-events-none" />
    </div>
  );
};

// ============== MAIN COMPONENT ==============

const WEATHER_CONDITIONS = [
  "sunny",
  "cloudy",
  "overcast",
  "rainy",
  "drizzle",
  "snowy",
  "hail",
  "stormy",
  "windy",
  "foggy",
];

export function WeatherBackground({ onWeatherUpdate, enableAutoWeather = true }: WeatherBackgroundProps) {
  const [weather, setWeather] = useState<WeatherState>({
    condition: "sunny",
    isDay: isDaytime(),
    temperature: 25,
    windSpeed: 0.5,
    humidity: 60,
    feelsLike: 24,
    visibility: 10,
    pressure: 1013,
    uvIndex: 5,
  });

  const [time, setTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Check if day/night changes with time
  useEffect(() => {
    const currentIsDay = isDaytime();
    setWeather((prev) => {
      if (prev.isDay !== currentIsDay) {
        return { ...prev, isDay: currentIsDay };
      }
      return prev;
    });
  }, [time]);

  // Auto weather changes
  useEffect(() => {
    if (!enableAutoWeather) return;

    const interval = setInterval(() => {
      setWeather((prev) => {
        const windVariation = (Math.random() - 0.5) * 0.3;
        const humidityVariation = Math.random() * 25 - 12.5;
        const tempVariation = (Math.random() - 0.5) * 3;

        // Occasionally change weather condition
        const changeWeather = Math.random() < 0.15;
        const newCondition = changeWeather
          ? WEATHER_CONDITIONS[Math.floor(Math.random() * WEATHER_CONDITIONS.length)]
          : prev.condition;

        // Temperature variations based on condition
        let tempAdjustment = 0;
        if (newCondition === "snowy" || newCondition === "hail") tempAdjustment = -8;
        if (newCondition === "sunny") tempAdjustment = 5;
        if (newCondition === "stormy") tempAdjustment = -3;

        const newWeather = {
          ...prev,
          condition: newCondition,
          windSpeed: Math.max(0, Math.min(3, prev.windSpeed + windVariation)),
          humidity: Math.max(30, Math.min(100, prev.humidity + humidityVariation)),
          temperature: Math.max(-10, Math.min(45, prev.temperature + tempVariation + tempAdjustment)),
        };

        // Calculate feels like temperature
        const windChill = newWeather.windSpeed > 1 ? -newWeather.windSpeed * 2 : 0;
        newWeather.feelsLike = newWeather.temperature + windChill;

        // Update visibility based on weather
        if (newCondition === "foggy") newWeather.visibility = Math.random() * 3 + 0.5;
        if (newCondition === "rainy" || newCondition === "stormy") newWeather.visibility = Math.random() * 5 + 3;
        if (newCondition === "sunny") newWeather.visibility = 10;

        // Update pressure (affects weather)
        newWeather.pressure = 1013 + (Math.random() - 0.5) * 20;

        // UV index (only during day)
        if (newWeather.isDay) {
          newWeather.uvIndex = Math.max(
            0,
            Math.min(
              11,
              newCondition === "sunny" ? Math.random() * 8 + 3 : Math.random() * 3
            )
          );
        } else {
          newWeather.uvIndex = 0;
        }

        onWeatherUpdate?.(newWeather);
        return newWeather;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [enableAutoWeather, onWeatherUpdate]);

  const getBackgroundComponent = () => {
    const normalized = weather.condition.toLowerCase();
    const { humidity, temperature, windSpeed, visibility } = weather;

    // Night time backgrounds
    if (!weather.isDay) {
      if (normalized.includes("rain") || normalized.includes("storm")) {
        return <StormBackground />;
      }
      if (normalized.includes("snow")) {
        return <SnowBackground windSpeed={windSpeed} intensity={humidity / 100} />;
      }
      if (normalized.includes("fog") || normalized.includes("mist")) {
        return <FoggyBackground windSpeed={windSpeed} visibility={visibility / 10} />;
      }
      return <NightBackground cloudCover={humidity / 100} temperature={temperature} />;
    }

    // Daytime - check sunrise/sunset times
    const { sunrise, sunset } = calculateSunTimes();
    const currentHour = new Date().getHours() + new Date().getMinutes() / 60;

    // Sunrise (5-7 AM typically)
    if (currentHour >= sunrise - 1 && currentHour < sunrise + 1) {
      return <SunriseBackground temperature={temperature} />;
    }

    // Sunset (5-7 PM typically)
    if (currentHour >= sunset - 1 && currentHour < sunset + 1) {
      return <SunsetBackground temperature={temperature} />;
    }

    // Day conditions
    if (normalized.includes("snow")) {
      return <SnowBackground windSpeed={windSpeed} intensity={humidity / 100} />;
    }

    if (normalized.includes("rain") || normalized.includes("drizzle")) {
      return normalized.includes("drizzle") ? (
        <DrizzleBackground windSpeed={windSpeed} />
      ) : (
        <RainyBackground windSpeed={windSpeed} intensity={humidity / 100} />
      );
    }

    if (normalized.includes("thunder") || normalized.includes("storm")) {
      return <StormBackground />;
    }

    if (normalized.includes("hail")) {
      return <HailBackground windSpeed={windSpeed} />;
    }

    if (normalized.includes("fog") || normalized.includes("mist")) {
      return <FoggyBackground windSpeed={windSpeed} visibility={visibility / 10} />;
    }

    if (normalized.includes("windy") || windSpeed > 2) {
      return <WindyBackground windSpeed={windSpeed} />;
    }

    if (normalized.includes("cloud") || normalized.includes("overcast")) {
      return normalized.includes("overcast") ? (
        <OvercastBackground />
      ) : (
        <CloudyBackground windSpeed={windSpeed} cloudCover={humidity / 100} />
      );
    }

    if (normalized.includes("sun") || normalized.includes("clear")) {
      return <SunnyBackground temperature={temperature} />;
    }

    return <SunnyBackground temperature={temperature} />;
  };

  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-slate-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${weather.condition}-${weather.isDay}-${hours}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          {getBackgroundComponent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

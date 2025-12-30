import { useEffect, useState } from "react";
import { Heart } from "../PixelArt";
import { CountdownUnit } from "./CountdownUnit";

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
}

function calculateTimeRemaining(targetDate: string): TimeRemaining {
  const now = Date.now();
  const target = new Date(targetDate).getTime();
  const difference = target - now;

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      isComplete: true,
      minutes: 0,
      seconds: 0
    };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    isComplete: false,
    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((difference % (1000 * 60)) / 1000)
  };
}

export function Countdown({ targetDate }: { targetDate: string }) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(
    calculateTimeRemaining(targetDate)
  );

  useEffect(() => {
    // Update countdown every second
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeRemaining.isComplete) {
    return (
      <div className="bg-white/80 backdrop-blur-sm border-y border-pink-200 py-6 md:py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-3">
              <Heart className="w-10 h-10 md:w-12 md:h-12" animated />
              <h2 className="text-2xl md:text-3xl font-bold text-pink-600 text-center">
                Veľký deň je tu!
              </h2>
              <Heart className="w-10 h-10 md:w-12 md:h-12" animated />
            </div>
            <p className="text-pink-500 text-sm md:text-base">
              Vitajte na našej svadbe 💒
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm border-y border-pink-200 py-2 md:py-3">
      <div className="container mx-auto px-2 md:px-4 max-w-4xl">
        {/* Single row layout for all devices */}
        <div className="flex justify-center items-center gap-1 md:gap-3">
          <CountdownUnit value={timeRemaining.days} label="DNÍ" />
          <Heart className="w-4 h-4 md:w-6 md:h-6 countdown-pulse" />
          <CountdownUnit value={timeRemaining.hours} label="HODÍN" />
          <Heart className="w-4 h-4 md:w-6 md:h-6 countdown-pulse" />
          <CountdownUnit value={timeRemaining.minutes} label="MINÚT" />
          <Heart className="w-4 h-4 md:w-6 md:h-6 countdown-pulse" />
          <CountdownUnit value={timeRemaining.seconds} label="SEKÚND" />
        </div>
      </div>
    </div>
  );
}

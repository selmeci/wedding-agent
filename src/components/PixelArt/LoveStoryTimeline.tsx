import { BabyCrawling } from "./BabyCrawling";
import { BabySitting } from "./BabySitting";
import { CoupleWalking } from "./CoupleWalking";
import { Proposal } from "./Proposal";
import { WeddingCouple } from "./WeddingCouple";

export function LoveStoryTimeline({ className = "" }: { className?: string }) {
  const milestones = [
    {
      Component: BabyCrawling,
      date: "13.11.1985",
      label: "Narodenie ženícha"
    },
    {
      Component: BabySitting,
      date: "27.10.1991",
      label: "Narodenie nevesty"
    },
    {
      Component: CoupleWalking,
      date: "25.3.2023",
      label: "A sme pár"
    },
    {
      Component: Proposal,
      date: "23.3.2025",
      label: "Zásnuby"
    },
    {
      Component: WeddingCouple,
      date: "27.3.2026",
      label: "Svadba"
    }
  ];

  return (
    <div className={`w-full py-8 px-4 ${className}`}>
      {/* Vertical Timeline */}
      <div className="max-w-2xl mx-auto">
        {/* Timeline items */}
        <div className="space-y-6 md:space-y-8">
          {milestones.map((milestone, index) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: it is ok here
              key={index}
              className="relative flex items-center gap-6 md:gap-8 group"
            >
              {/* Pixel art icon */}
              <div className="flex-shrink-0 w-24 md:w-32 h-24 md:h-32 flex items-center justify-center bg-white rounded-full shadow-lg border-4 border-pink-200 transition-transform hover:scale-110 duration-300 relative z-10">
                <milestone.Component className="w-16 md:w-20 h-16 md:h-20 drop-shadow-md" />
              </div>

              {/* Text content */}
              <div className="flex-1 bg-white/90 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-md border border-pink-100 transition-all hover:shadow-lg hover:border-pink-200">
                <span className="block font-serif text-xl md:text-2xl font-bold text-pink-600 mb-1">
                  {milestone.date}
                </span>
                <span className="block text-base md:text-lg font-medium text-pink-500">
                  {milestone.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

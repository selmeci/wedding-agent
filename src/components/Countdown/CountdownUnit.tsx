import { PixelDigit } from "./PixelDigit";

/**
 * Single countdown unit (e.g., "42 DNÍ")
 * Displays 2-digit number with pixel art and label
 */
export function CountdownUnit({
  value,
  label,
  className = ""
}: {
  value: number;
  label: string;
  className?: string;
}) {
  // Ensure 2 digits with leading zero
  const tens = Math.floor(value / 10) % 10;
  const ones = value % 10;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Digits container */}
      <div className="flex gap-0.5 mb-1 bg-pink-50/80 rounded-lg px-2 py-1 shadow-sm">
        <PixelDigit digit={tens} />
        <PixelDigit digit={ones} />
      </div>

      {/* Label */}
      <span className="text-[10px] md:text-xs font-semibold text-pink-600 uppercase tracking-wide">
        {label}
      </span>
    </div>
  );
}

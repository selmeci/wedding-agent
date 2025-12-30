export function Groom({ className = "" }: { className?: string }) {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pixel-art ${className}`}
      role="img"
      aria-label="Ženích"
    >
      {/* === LEGS & SHOES === */}
      {/* Left Leg */}
      <rect x="24" y="44" width="6" height="18" fill="#1F2937" />
      <rect x="22" y="62" width="8" height="2" fill="#111827" /> {/* Shoe */}
      <rect
        x="26"
        y="44"
        width="1"
        height="18"
        fill="#111827"
        opacity="0.3"
      />{" "}
      {/* Crease/Shadow */}
      {/* Right Leg */}
      <rect x="34" y="44" width="6" height="18" fill="#1F2937" />
      <rect x="34" y="62" width="8" height="2" fill="#111827" /> {/* Shoe */}
      <rect
        x="37"
        y="44"
        width="1"
        height="18"
        fill="#111827"
        opacity="0.3"
      />{" "}
      {/* Crease/Shadow */}
      {/* === TORSO (Suit) === */}
      <rect x="22" y="26" width="20" height="18" fill="#1F2937" />
      {/* Jacket Shadow/Shape */}
      <rect
        x="22"
        y="42"
        width="20"
        height="2"
        fill="#111827"
        opacity="0.4"
      />{" "}
      {/* Hem */}
      {/* White Shirt Area */}
      <rect x="28" y="26" width="8" height="10" fill="#FFFFFF" />
      {/* Lapels */}
      <rect x="26" y="26" width="2" height="10" fill="#111827" />
      <rect x="36" y="26" width="2" height="10" fill="#111827" />
      {/* Bow Tie */}
      <rect x="30" y="27" width="4" height="2" fill="#111827" />
      <rect x="29" y="26" width="6" height="1" fill="#111827" />
      {/* Buttons */}
      <rect x="31" y="32" width="2" height="2" fill="#D1D5DB" />
      <rect x="31" y="38" width="2" height="2" fill="#1F2937" />{" "}
      {/* Jacket button */}
      {/* Flower in Lapel (Boutonnière) */}
      <rect x="37" y="30" width="2" height="2" fill="#F472B6" />{" "}
      {/* Pink flower */}
      <rect x="37" y="32" width="1" height="2" fill="#22C55E" /> {/* Stem */}
      {/* === ARMS === */}
      {/* Left Arm (Relaxed at side) */}
      <rect x="18" y="28" width="4" height="14" fill="#1F2937" />
      <rect x="18" y="42" width="4" height="4" fill="#FFD4A3" /> {/* Hand */}
      <rect
        x="18"
        y="40"
        width="4"
        height="2"
        fill="#FFFFFF"
        opacity="0.8"
      />{" "}
      {/* Cuff */}
      {/* Right Arm (Relaxed at side) */}
      <rect x="42" y="28" width="4" height="14" fill="#1F2937" />
      <rect x="42" y="42" width="4" height="4" fill="#FFD4A3" /> {/* Hand */}
      <rect
        x="42"
        y="40"
        width="4"
        height="2"
        fill="#FFFFFF"
        opacity="0.8"
      />{" "}
      {/* Cuff */}
      {/* === HEAD === */}
      {/* Neck */}
      <rect x="28" y="24" width="8" height="2" fill="#FFD4A3" />
      {/* Face Shape */}
      <rect x="26" y="12" width="12" height="12" fill="#FFD4A3" />
      {/* Ears */}
      <rect x="24" y="16" width="2" height="4" fill="#FFD4A3" />
      <rect x="38" y="16" width="2" height="4" fill="#FFD4A3" />
      {/* Face Features */}
      <rect x="28" y="16" width="2" height="2" fill="#1F2937" />{" "}
      {/* Left Eye */}
      <rect x="34" y="16" width="2" height="2" fill="#1F2937" />{" "}
      {/* Right Eye */}
      <rect
        x="29"
        y="20"
        width="6"
        height="1"
        fill="#D97706"
        opacity="0.6"
      />{" "}
      {/* Smile */}
      <rect
        x="28"
        y="19"
        width="1"
        height="1"
        fill="#D97706"
        opacity="0.4"
      />{" "}
      {/* Corner */}
      <rect
        x="35"
        y="19"
        width="1"
        height="1"
        fill="#D97706"
        opacity="0.4"
      />{" "}
      {/* Corner */}
      {/* Hair (Dark Brown) */}
      <rect x="24" y="8" width="16" height="4" fill="#2C1810" />
      <rect x="24" y="12" width="2" height="4" fill="#2C1810" />{" "}
      {/* Sideburn */}
      <rect x="38" y="12" width="2" height="4" fill="#2C1810" />{" "}
      {/* Sideburn */}
      {/* Hair Styling/Highlight */}
      <rect x="26" y="8" width="4" height="2" fill="#4A2C20" />
      <rect x="24" y="9" width="2" height="1" fill="#2C1810" />{" "}
      {/* Messy bit */}
    </svg>
  );
}

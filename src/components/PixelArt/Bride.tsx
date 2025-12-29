export function Bride({ className = "" }: { className?: string }) {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pixel-art ${className}`}
      role="img"
      aria-label="Nevesta"
    >
      {/* === DRESS (Bottom/Skirt) === */}
      {/* Main Bell Shape */}
      <rect x="20" y="44" width="24" height="20" fill="#FFFFFF" />
      <rect x="18" y="48" width="2" height="16" fill="#FFFFFF" />
      <rect x="44" y="48" width="2" height="16" fill="#FFFFFF" />
      {/* Shadows/Folds - Adds depth to fabric */}
      <rect x="24" y="44" width="2" height="20" fill="#F3F4F6" />
      <rect x="30" y="46" width="4" height="18" fill="#F3F4F6" />
      <rect x="38" y="44" width="2" height="20" fill="#F3F4F6" />
      {/* Hem trim (lace?) */}
      <rect x="18" y="62" width="28" height="2" fill="#E5E7EB" />
      {/* === TORSO === */}
      <rect x="22" y="28" width="20" height="16" fill="#FFFFFF" />
      {/* Bodice details */}
      <rect x="24" y="30" width="16" height="8" fill="#F9FAFB" />{" "}
      {/* Lighter top */}
      <rect
        x="26"
        y="32"
        width="12"
        height="4"
        fill="#FFE3E8"
        opacity="0.3"
      />{" "}
      {/* Slight pink tint */}
      {/* Neckline */}
      <rect x="26" y="26" width="12" height="2" fill="#FFD4A3" />
      {/* === ARMS === */}
      {/* Left Arm */}
      <rect x="20" y="28" width="4" height="12" fill="#FFD4A3" />
      {/* Right Arm */}
      <rect x="40" y="28" width="4" height="12" fill="#FFD4A3" />
      {/* Hands holding bouquet - Meeting in middle */}
      <rect x="24" y="36" width="6" height="4" fill="#FFD4A3" />
      <rect x="34" y="36" width="6" height="4" fill="#FFD4A3" />
      {/* === BOUQUET === */}
      {/* Greenery */}
      <rect x="28" y="40" width="8" height="4" fill="#22C55E" />
      <rect x="30" y="44" width="4" height="4" fill="#15803D" /> {/* Stems */}
      {/* Flowers */}
      <rect x="29" y="38" width="3" height="3" fill="#EC4899" /> {/* Pink */}
      <rect x="33" y="39" width="3" height="3" fill="#F43F5E" /> {/* Reddish */}
      <rect x="27" y="41" width="2" height="2" fill="#FBCFE8" />{" "}
      {/* Light pink */}
      <rect x="35" y="41" width="2" height="2" fill="#FBCFE8" />
      {/* === HEAD === */}
      {/* Neck */}
      <rect x="29" y="24" width="6" height="2" fill="#FFD4A3" />
      {/* Face Shape */}
      <rect x="26" y="14" width="12" height="12" fill="#FFD4A3" />
      {/* Face Features */}
      <rect x="28" y="18" width="2" height="2" fill="#1F2937" />{" "}
      {/* Left Eye */}
      <rect x="34" y="18" width="2" height="2" fill="#1F2937" />{" "}
      {/* Right Eye */}
      <rect
        x="27"
        y="21"
        width="2"
        height="2"
        fill="#FF9BB0"
        opacity="0.4"
      />{" "}
      {/* Cheek */}
      <rect
        x="35"
        y="21"
        width="2"
        height="2"
        fill="#FF9BB0"
        opacity="0.4"
      />{" "}
      {/* Cheek */}
      <rect
        x="30"
        y="23"
        width="4"
        height="1"
        fill="#D97706"
        opacity="0.6"
      />{" "}
      {/* Smile */}
      {/* === HAIR (Blonde) === */}
      <rect x="24" y="10" width="16" height="6" fill="#F4E4C1" />
      <rect x="24" y="14" width="2" height="8" fill="#F4E4C1" /> {/* Side */}
      <rect x="38" y="14" width="2" height="8" fill="#F4E4C1" /> {/* Side */}
      {/* Bun / Updo */}
      <rect x="28" y="6" width="8" height="4" fill="#F4E4C1" />
      {/* === VEIL === */}
      {/* Top part */}
      <rect x="24" y="8" width="16" height="2" fill="#FFFFFF" opacity="0.8" />
      {/* Flowing down back */}
      <rect x="20" y="10" width="4" height="20" fill="#FFFFFF" opacity="0.6" />
      <rect x="40" y="10" width="4" height="20" fill="#FFFFFF" opacity="0.6" />
      {/* Bottom of veil */}
      <rect x="16" y="28" width="4" height="10" fill="#FFFFFF" opacity="0.4" />
      <rect x="44" y="28" width="4" height="10" fill="#FFFFFF" opacity="0.4" />
      {/* Tiara/Decoration */}
      <rect x="28" y="9" width="8" height="1" fill="#E5E7EB" />
      <rect x="31" y="8" width="2" height="1" fill="#FBCFE8" /> {/* Jewel */}
    </svg>
  );
}

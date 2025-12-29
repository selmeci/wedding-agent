export function BabySitting({ className = "" }: { className?: string }) {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pixel-art ${className}`}
      role="img"
      aria-label="Bábätko sediace"
    >
      {/* === LEGS (Sitting position) === */}
      {/* Left Leg (bent forward) */}
      <rect x="22" y="52" width="6" height="4" fill="#FFD4A3" /> {/* Leg */}
      <rect x="20" y="54" width="4" height="4" fill="#FFD4A3" /> {/* Foot */}
      <rect x="22" y="56" width="2" height="2" fill="#E0B88A" />{" "}
      {/* Sole shadow */}
      {/* Right Leg (bent forward) */}
      <rect x="36" y="52" width="6" height="4" fill="#FFD4A3" /> {/* Leg */}
      <rect x="40" y="54" width="4" height="4" fill="#FFD4A3" /> {/* Foot */}
      <rect x="40" y="56" width="2" height="2" fill="#E0B88A" />{" "}
      {/* Sole shadow */}
      {/* Shadow under baby */}
      <rect x="20" y="58" width="24" height="2" fill="#E5E7EB" opacity="0.6" />
      {/* === BODY / DRESS === */}
      {/* Main Dress Body (Pink) */}
      <rect x="24" y="42" width="16" height="12" fill="#FFE3E8" />
      {/* Dress Bottom Folds/Shadows */}
      <rect x="24" y="52" width="16" height="2" fill="#FFC9D4" />
      <rect x="28" y="52" width="2" height="2" fill="#FF9BB0" />
      <rect x="34" y="52" width="2" height="2" fill="#FF9BB0" />
      {/* Collar / Bib */}
      <rect x="26" y="42" width="12" height="4" fill="#FFFFFF" />
      <rect x="30" y="44" width="4" height="2" fill="#FFE3E8" />{" "}
      {/* Neck opening */}
      {/* === ARMS === */}
      {/* Left Arm (resting on leg/ground) */}
      <rect x="20" y="44" width="4" height="6" fill="#FFD4A3" />
      <rect x="18" y="48" width="4" height="4" fill="#FFD4A3" /> {/* Hand */}
      <rect x="24" y="44" width="2" height="2" fill="#FFE3E8" /> {/* Sleeve */}
      {/* Right Arm (raised slightly/waving) */}
      <rect x="40" y="42" width="4" height="6" fill="#FFD4A3" />
      <rect x="42" y="38" width="4" height="4" fill="#FFD4A3" />{" "}
      {/* Hand raised */}
      <rect x="38" y="42" width="2" height="2" fill="#FFE3E8" /> {/* Sleeve */}
      {/* === HEAD === */}
      {/* Neck */}
      <rect x="28" y="40" width="8" height="2" fill="#FFD4A3" />
      {/* Face Shape */}
      <rect x="24" y="24" width="16" height="16" fill="#FFD4A3" />
      {/* Face Features */}
      {/* Eyes */}
      <rect x="27" y="30" width="3" height="3" fill="#1F2937" />
      <rect x="28" y="30" width="1" height="1" fill="#FFFFFF" /> {/* Glint */}
      <rect x="34" y="30" width="3" height="3" fill="#1F2937" />
      <rect x="35" y="30" width="1" height="1" fill="#FFFFFF" /> {/* Glint */}
      {/* Cheeks */}
      <rect x="26" y="34" width="2" height="2" fill="#FF9BB0" opacity="0.5" />
      <rect x="36" y="34" width="2" height="2" fill="#FF9BB0" opacity="0.5" />
      {/* Smile */}
      <rect x="30" y="36" width="4" height="1" fill="#D97706" />
      <rect x="29" y="35" width="1" height="1" fill="#D97706" opacity="0.7" />
      <rect x="34" y="35" width="1" height="1" fill="#D97706" opacity="0.7" />
      {/* === HAIR (Bride - Blonde) === */}
      {/* Main Hair */}
      <rect x="22" y="20" width="20" height="6" fill="#F4E4C1" />
      <rect x="20" y="24" width="4" height="8" fill="#F4E4C1" />{" "}
      {/* Left pigtail base */}
      <rect x="40" y="24" width="4" height="8" fill="#F4E4C1" />{" "}
      {/* Right pigtail base */}
      {/* Bangs */}
      <rect x="24" y="22" width="4" height="4" fill="#F4E4C1" />
      <rect x="30" y="22" width="4" height="3" fill="#F4E4C1" />
      <rect x="36" y="22" width="4" height="4" fill="#F4E4C1" />
      {/* Big Pink Bow */}
      <rect x="30" y="16" width="4" height="4" fill="#FF6B8E" /> {/* Knot */}
      <rect x="26" y="16" width="4" height="4" fill="#FF6B8E" />{" "}
      {/* Left loop */}
      <rect x="34" y="16" width="4" height="4" fill="#FF6B8E" />{" "}
      {/* Right loop */}
      <rect x="28" y="18" width="2" height="1" fill="#FF9BB0" />{" "}
      {/* Highlight */}
      <rect x="36" y="18" width="2" height="1" fill="#FF9BB0" />{" "}
      {/* Highlight */}
    </svg>
  );
}

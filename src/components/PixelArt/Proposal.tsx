export function Proposal({ className = "" }: { className?: string }) {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pixel-art ${className}`}
      role="img"
      aria-label="Žiadosť o ruku"
    >
      {/* === BRIDE (Left - Surprised) === */}
      {/* -- Legs -- */}
      <rect x="14" y="50" width="3" height="10" fill="#FFD4A3" />
      <rect x="20" y="50" width="3" height="10" fill="#FFD4A3" />
      {/* Shoes (Pink Heels) */}
      <rect x="14" y="60" width="4" height="2" fill="#BE185D" />
      <rect x="20" y="60" width="4" height="2" fill="#BE185D" />
      {/* -- Dress (Pink/Magenta Cocktail Dress) -- */}
      <rect x="12" y="34" width="14" height="16" fill="#EC4899" />
      <rect x="13" y="26" width="12" height="8" fill="#EC4899" />
      {/* Dress Shadows */}
      <rect x="14" y="34" width="1" height="16" fill="#BE185D" opacity="0.5" />
      <rect x="22" y="34" width="1" height="16" fill="#BE185D" opacity="0.5" />
      {/* -- Head -- */}
      {/* Neck */}
      <rect x="17" y="24" width="4" height="2" fill="#FFD4A3" />
      {/* Face */}
      <rect x="15" y="14" width="10" height="10" fill="#FFD4A3" />
      {/* Face Features - Surprised */}
      <rect x="16" y="17" width="2" height="2" fill="#1F2937" />{" "}
      {/* Left Eye */}
      <rect x="21" y="17" width="2" height="2" fill="#1F2937" />{" "}
      {/* Right Eye */}
      {/* Eyebrows raised */}
      <rect x="16" y="15" width="2" height="1" fill="#854D0E" />
      <rect x="21" y="15" width="2" height="1" fill="#854D0E" />
      {/* -- Arms (Surprise Gesture) -- */}
      {/* Left arm (down/bent) */}
      <rect x="11" y="27" width="2" height="8" fill="#FFD4A3" />
      {/* Right arm (Hand to mouth - Shock!) */}
      <rect x="23" y="28" width="3" height="4" fill="#FFD4A3" />{" "}
      {/* Upper arm */}
      <rect x="20" y="24" width="4" height="3" fill="#FFD4A3" />{" "}
      {/* Forearm/Hand covering mouth */}
      {/* Hair (Blonde) */}
      <rect x="14" y="10" width="12" height="5" fill="#F4E4C1" />
      <rect x="13" y="12" width="2" height="8" fill="#F4E4C1" />
      <rect x="24" y="12" width="2" height="8" fill="#F4E4C1" />
      {/* === GROOM (Right - Kneeling) === */}
      {/* -- Legs (Kneeling Pose) -- */}
      {/* Back leg (Kneeling on ground) */}
      <rect x="48" y="52" width="10" height="4" fill="#1F2937" /> {/* Thigh */}
      <rect x="48" y="56" width="4" height="4" fill="#1F2937" />{" "}
      {/* Knee on ground */}
      <rect x="58" y="54" width="2" height="4" fill="#111827" />{" "}
      {/* Shoe tip */}
      {/* Front leg (Bent upright) */}
      <rect x="38" y="50" width="4" height="10" fill="#1F2937" /> {/* Shin */}
      <rect x="40" y="46" width="8" height="4" fill="#1F2937" />{" "}
      {/* Thigh foreshortened */}
      <rect x="36" y="60" width="6" height="2" fill="#111827" />{" "}
      {/* Shoe flat */}
      {/* -- Torso -- */}
      <rect x="40" y="28" width="12" height="18" fill="#374151" />
      {/* Jacket overlap */}
      <rect x="40" y="44" width="12" height="4" fill="#374151" />
      {/* -- Head -- */}
      <rect x="44" y="26" width="4" height="2" fill="#FFD4A3" /> {/* Neck */}
      <rect x="42" y="16" width="9" height="10" fill="#FFD4A3" /> {/* Face */}
      {/* Face Features - Smiling/Hopeful */}
      <rect x="43" y="19" width="2" height="2" fill="#1F2937" /> {/* Eye */}
      <rect x="47" y="19" width="2" height="2" fill="#1F2937" /> {/* Eye */}
      <rect
        x="44"
        y="23"
        width="3"
        height="1"
        fill="#000000"
        opacity="0.3"
      />{" "}
      {/* Smile */}
      {/* Hair (Dark) */}
      <rect x="41" y="12" width="11" height="5" fill="#2C1810" />
      <rect x="51" y="14" width="1" height="4" fill="#2C1810" />
      {/* -- Arms -- */}
      {/* Right arm (back/balance) */}
      <rect x="52" y="30" width="3" height="10" fill="#374151" />
      {/* Left arm (EXTENDED with Ring) */}
      <rect x="36" y="32" width="6" height="3" fill="#374151" /> {/* Arm */}
      <rect x="34" y="31" width="3" height="3" fill="#FFD4A3" /> {/* Hand */}
      {/* === THE RING & BOX === */}
      {/* Ring Box (Black/Velvet) */}
      <rect x="30" y="30" width="4" height="3" fill="#111827" />
      {/* Gold Band */}
      <rect x="31" y="28" width="2" height="2" fill="#F59E0B" />
      {/* THE DIAMOND (Big & Sparkly) */}
      <rect x="31" y="26" width="2" height="2" fill="#E0F2FE" />{" "}
      {/* Main stone */}
      <rect
        x="30"
        y="25"
        width="4"
        height="4"
        fill="#FFFFFF"
        opacity="0.6"
      />{" "}
      {/* Glow */}
      {/* Sparkles/Glints */}
      <rect x="31" y="24" width="2" height="1" fill="#FFFFFF" />{" "}
      {/* Top glint */}
      <rect x="31" y="29" width="2" height="1" fill="#FFFFFF" />{" "}
      {/* Bottom glint */}
      <rect x="29" y="26" width="1" height="2" fill="#FFFFFF" />{" "}
      {/* Left glint */}
      <rect x="34" y="26" width="1" height="2" fill="#FFFFFF" />{" "}
      {/* Right glint */}
    </svg>
  );
}

export function WeddingCouple({ className = "" }: { className?: string }) {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pixel-art ${className}`}
      role="img"
      aria-label="Svadobný pár"
    >
      {/* === GROOM (Left) === */}
      {/* -- Legs & Shoes -- */}
      {/* Left leg (back) */}
      <rect x="22" y="48" width="5" height="14" fill="#1F2937" />
      <rect x="21" y="62" width="6" height="2" fill="#111827" /> {/* Shoe */}
      {/* Right leg (front) */}
      <rect x="29" y="48" width="5" height="14" fill="#1F2937" />
      <rect x="29" y="62" width="6" height="2" fill="#111827" /> {/* Shoe */}
      {/* -- Torso / Suit -- */}
      <rect x="21" y="28" width="14" height="20" fill="#1F2937" />
      {/* Lapels (Shadow) */}
      <rect x="24" y="29" width="1" height="8" fill="#111827" opacity="0.5" />
      <rect x="31" y="29" width="1" height="8" fill="#111827" opacity="0.5" />
      {/* Shirt (White V) */}
      <rect x="26" y="28" width="4" height="6" fill="#FFFFFF" />
      {/* Bow Tie */}
      <rect x="27" y="29" width="2" height="1" fill="#111827" />
      <rect x="26" y="28" width="1" height="1" fill="#111827" />
      <rect x="29" y="28" width="1" height="1" fill="#111827" />
      {/* -- Arms -- */}
      {/* Left Arm (down by side) */}
      <rect x="19" y="29" width="3" height="12" fill="#1F2937" />
      <rect x="19" y="41" width="3" height="3" fill="#FFD4A3" /> {/* Hand */}
      {/* Right Arm (reaching for bride) */}
      <rect x="34" y="32" width="7" height="3" fill="#1F2937" />
      {/* -- Head -- */}
      {/* Neck */}
      <rect x="26" y="26" width="4" height="2" fill="#FFD4A3" />
      {/* Face */}
      <rect x="24" y="16" width="9" height="10" fill="#FFD4A3" />
      {/* Ear */}
      <rect x="23" y="20" width="1" height="3" fill="#E0B88A" />
      {/* Face Features */}
      <rect x="29" y="19" width="2" height="2" fill="#1F2937" /> {/* Eye */}
      <rect
        x="29"
        y="23"
        width="3"
        height="1"
        fill="#C29470"
        opacity="0.6"
      />{" "}
      {/* Smile shadow */}
      {/* Hair */}
      <rect x="23" y="14" width="10" height="4" fill="#2C1810" />
      <rect x="23" y="15" width="2" height="6" fill="#2C1810" />{" "}
      {/* Sideburns */}
      <rect x="24" y="13" width="8" height="2" fill="#4A2C20" />{" "}
      {/* Highlight */}
      {/* === BRIDE (Right) === */}
      {/* -- Dress (Bottom/Skirt) -- */}
      {/* Main flowy shape */}
      <rect x="42" y="44" width="14" height="20" fill="#FFFFFF" />
      <rect x="40" y="48" width="2" height="16" fill="#FFFFFF" />
      <rect x="56" y="48" width="2" height="16" fill="#FFFFFF" />
      {/* Shadows / Folds in dress */}
      <rect x="45" y="46" width="1" height="16" fill="#F3F4F6" />
      <rect x="52" y="46" width="1" height="16" fill="#F3F4F6" />
      <rect x="48" y="52" width="2" height="10" fill="#F3F4F6" />
      {/* -- Torso -- */}
      <rect x="44" y="29" width="10" height="15" fill="#FFFFFF" />
      <rect
        x="46"
        y="30"
        width="6"
        height="4"
        fill="#FFE3E8"
        opacity="0.3"
      />{" "}
      {/* Subtle detail */}
      {/* -- Arms -- */}
      {/* Right Arm (down) */}
      <rect x="54" y="32" width="3" height="10" fill="#FFD4A3" />
      {/* Left Arm (holding groom) */}
      <rect x="41" y="32" width="4" height="3" fill="#FFD4A3" />
      {/* -- Head -- */}
      {/* Neck */}
      <rect x="47" y="27" width="4" height="2" fill="#FFD4A3" />
      {/* Face */}
      <rect x="45" y="17" width="9" height="10" fill="#FFD4A3" />
      {/* Cheek */}
      <rect x="46" y="22" width="2" height="2" fill="#FF9BB0" opacity="0.4" />
      {/* Face Features */}
      <rect x="46" y="20" width="2" height="2" fill="#1F2937" /> {/* Eye */}
      <rect
        x="45"
        y="24"
        width="2"
        height="1"
        fill="#D97706"
        opacity="0.5"
      />{" "}
      {/* Lips */}
      {/* Hair */}
      <rect x="44" y="15" width="12" height="6" fill="#F4E4C1" />
      <rect x="54" y="18" width="4" height="12" fill="#F4E4C1" />{" "}
      {/* Long hair back */}
      <rect x="43" y="17" width="2" height="6" fill="#F4E4C1" />{" "}
      {/* Side framing */}
      {/* Veil */}
      <rect x="44" y="14" width="14" height="2" fill="#FFFFFF" opacity="0.7" />
      <rect x="56" y="16" width="8" height="30" fill="#FFFFFF" opacity="0.4" />
      {/* Flower in hair */}
      <rect x="53" y="15" width="3" height="3" fill="#FFFFFFFF" />
      <rect x="54" y="16" width="1" height="1" fill="#FF9BB0" />
      {/* === HEART (Floating above) === */}
      {/* Shadow/Outline */}
      <rect x="36" y="6" width="2" height="2" fill="#BE185D" />
      <rect x="40" y="6" width="2" height="2" fill="#BE185D" />
      <rect x="35" y="7" width="8" height="4" fill="#BE185D" />
      <rect x="36" y="11" width="6" height="2" fill="#BE185D" />
      <rect x="38" y="13" width="2" height="2" fill="#BE185D" />
      {/* Main Red */}
      <rect x="36" y="7" width="2" height="2" fill="#EC4899" />
      <rect x="40" y="7" width="2" height="2" fill="#EC4899" />
      <rect x="36" y="8" width="6" height="3" fill="#EC4899" />
      <rect x="37" y="11" width="4" height="2" fill="#EC4899" />
      <rect x="38" y="13" width="2" height="1" fill="#EC4899" />
      {/* Highlight */}
      <rect x="37" y="8" width="1" height="1" fill="#FFFFFF" opacity="0.8" />
    </svg>
  );
}

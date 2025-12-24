export function Bride({ className = "" }: { className?: string }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pixel-art ${className}`}
      role="img"
      aria-label="Nevesta"
    >
      {/* Veil */}
      <rect x="8" y="4" width="16" height="2" fill="#FFFFFF" />
      <rect x="6" y="6" width="20" height="2" fill="#FFFFFF" />
      <rect x="6" y="8" width="4" height="4" fill="#FFFFFF" />
      <rect x="22" y="8" width="4" height="4" fill="#FFFFFF" />

      {/* Hair */}
      <rect x="10" y="6" width="12" height="2" fill="#8B4513" />
      <rect x="8" y="8" width="16" height="4" fill="#8B4513" />

      {/* Face */}
      <rect x="10" y="12" width="12" height="8" fill="#FFD4A3" />

      {/* Eyes */}
      <rect x="12" y="14" width="2" height="2" fill="#111827" />
      <rect x="18" y="14" width="2" height="2" fill="#111827" />

      {/* Smile */}
      <rect x="14" y="18" width="4" height="1" fill="#FF6B8E" />

      {/* Neck */}
      <rect x="14" y="20" width="4" height="2" fill="#FFD4A3" />

      {/* Dress body */}
      <rect x="10" y="22" width="12" height="6" fill="#FFFFFF" />
      <rect x="8" y="24" width="16" height="4" fill="#FFFFFF" />

      {/* Dress decoration (pink accents) */}
      <rect x="14" y="24" width="4" height="1" fill="#FF9BB0" />
      <rect x="12" y="26" width="8" height="1" fill="#FFE3E8" />

      {/* Arms */}
      <rect x="8" y="22" width="2" height="4" fill="#FFD4A3" />
      <rect x="22" y="22" width="2" height="4" fill="#FFD4A3" />

      {/* Hands holding bouquet */}
      <rect x="6" y="26" width="2" height="2" fill="#FFD4A3" />
      <rect x="24" y="26" width="2" height="2" fill="#FFD4A3" />

      {/* Bouquet */}
      <rect x="14" y="28" width="4" height="2" fill="#90EE90" />
      <rect x="13" y="27" width="2" height="1" fill="#FF9BB0" />
      <rect x="17" y="27" width="2" height="1" fill="#FF6B8E" />
      <rect x="15" y="26" width="2" height="1" fill="#FFE3E8" />
    </svg>
  );
}

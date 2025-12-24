export function Heart({
  className = "",
  animated = false
}: {
  className?: string;
  animated?: boolean;
}) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pixel-art ${className} ${animated ? "animate-pulse" : ""}`}
      role="img"
      aria-label="Srdce"
    >
      {/* Heart shape - top bulbs */}
      <rect x="8" y="8" width="6" height="2" fill="#FF3D6F" />
      <rect x="18" y="8" width="6" height="2" fill="#FF3D6F" />

      {/* Heart shape - main body */}
      <rect x="6" y="10" width="20" height="2" fill="#FF3D6F" />
      <rect x="6" y="12" width="20" height="2" fill="#FF6B8E" />
      <rect x="8" y="14" width="16" height="2" fill="#FF6B8E" />
      <rect x="10" y="16" width="12" height="2" fill="#FF9BB0" />
      <rect x="12" y="18" width="8" height="2" fill="#FF9BB0" />
      <rect x="14" y="20" width="4" height="2" fill="#FFC9D4" />

      {/* Heart outline - darker pink */}
      <rect x="6" y="8" width="2" height="2" fill="#E6215C" />
      <rect x="24" y="8" width="2" height="2" fill="#E6215C" />
      <rect x="4" y="10" width="2" height="4" fill="#E6215C" />
      <rect x="26" y="10" width="2" height="4" fill="#E6215C" />
      <rect x="6" y="14" width="2" height="2" fill="#E6215C" />
      <rect x="24" y="14" width="2" height="2" fill="#E6215C" />
      <rect x="8" y="16" width="2" height="2" fill="#E6215C" />
      <rect x="22" y="16" width="2" height="2" fill="#E6215C" />
      <rect x="10" y="18" width="2" height="2" fill="#E6215C" />
      <rect x="20" y="18" width="2" height="2" fill="#E6215C" />
      <rect x="12" y="20" width="2" height="2" fill="#E6215C" />
      <rect x="18" y="20" width="2" height="2" fill="#E6215C" />
      <rect x="14" y="22" width="4" height="2" fill="#E6215C" />

      {/* Highlight (lighter pink) */}
      <rect x="10" y="10" width="2" height="2" fill="#FFE3E8" />
      <rect x="12" y="12" width="2" height="2" fill="#FFE3E8" />
    </svg>
  );
}

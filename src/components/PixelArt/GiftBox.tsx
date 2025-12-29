interface GiftBoxProps {
  className?: string;
  animated?: boolean;
}

export function GiftBox({ className = "", animated = false }: GiftBoxProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      {/* Ribbon bow on top */}
      <rect x="14" y="4" width="4" height="2" fill="#FFD700" />
      <rect x="12" y="6" width="2" height="2" fill="#FFD700" />
      <rect x="18" y="6" width="2" height="2" fill="#FFD700" />
      <rect x="10" y="8" width="2" height="2" fill="#FFD700" />
      <rect x="20" y="8" width="2" height="2" fill="#FFD700" />

      {/* Top of box lid */}
      <rect x="8" y="10" width="16" height="2" fill="#FF69B4" />

      {/* Horizontal ribbon on lid */}
      <rect x="8" y="12" width="16" height="2" fill="#FFD700" />

      {/* Lid body */}
      <rect x="6" y="14" width="20" height="2" fill="#FF1493" />
      <rect x="6" y="16" width="20" height="2" fill="#FF69B4" />

      {/* Main box body */}
      <rect x="7" y="18" width="18" height="10" fill="#FF1493" />

      {/* Vertical ribbon down the middle */}
      <rect x="14" y="18" width="4" height="10" fill="#FFD700" />

      {/* Box bottom edge */}
      <rect x="8" y="28" width="16" height="2" fill="#C71585" />

      {/* Shadow/depth */}
      <rect x="24" y="18" width="2" height="10" fill="#C71585" />
      <rect x="7" y="28" width="18" height="2" fill="#8B0045" />

      {animated && (
        <style>
          {`
            @keyframes gift-float {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-2px); }
            }
            svg {
              animation: gift-float 2s ease-in-out infinite;
            }
          `}
        </style>
      )}
    </svg>
  );
}

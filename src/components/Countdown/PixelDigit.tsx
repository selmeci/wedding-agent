/**
 * Pixel art 7-segment display digit (0-9)
 * Each segment is rendered as a pixel block
 */

type SegmentMap = {
  [key: string]: boolean[];
};

// 7-segment display map: [top, topRight, bottomRight, bottom, bottomLeft, topLeft, middle]
const SEGMENT_MAP: SegmentMap = {
  "0": [true, true, true, true, true, true, false],
  "1": [false, true, true, false, false, false, false],
  "2": [true, true, false, true, true, false, true],
  "3": [true, true, true, true, false, false, true],
  "4": [false, true, true, false, false, true, true],
  "5": [true, false, true, true, false, true, true],
  "6": [true, false, true, true, true, true, true],
  "7": [true, true, true, false, false, false, false],
  "8": [true, true, true, true, true, true, true],
  "9": [true, true, true, true, false, true, true]
};

export function PixelDigit({
  digit,
  className = ""
}: {
  digit: number;
  className?: string;
}) {
  const segments = SEGMENT_MAP[digit.toString()] || SEGMENT_MAP["0"];
  const [top, topRight, bottomRight, bottom, bottomLeft, topLeft, middle] =
    segments;

  return (
    <div
      className={`relative inline-block ${className}`}
      style={{ width: "18px", height: "32px" }}
      role="img"
      aria-label={digit.toString()}
    >
      {/* SVG-based pixel art 7-segment display */}
      <svg
        width="18"
        height="32"
        viewBox="0 0 28 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="pixel-art"
        style={{ transform: "scale(0.64)" }}
      >
        {/* Top segment */}
        {top && (
          <>
            <rect x="6" y="2" width="16" height="3" fill="#E6215C" />
            <rect x="8" y="5" width="12" height="2" fill="#FF3D6F" />
          </>
        )}

        {/* Top-right segment */}
        {topRight && (
          <>
            <rect x="22" y="6" width="3" height="16" fill="#E6215C" />
            <rect x="20" y="8" width="2" height="12" fill="#FF3D6F" />
          </>
        )}

        {/* Bottom-right segment */}
        {bottomRight && (
          <>
            <rect x="22" y="26" width="3" height="16" fill="#E6215C" />
            <rect x="20" y="28" width="2" height="12" fill="#FF3D6F" />
          </>
        )}

        {/* Bottom segment */}
        {bottom && (
          <>
            <rect x="6" y="43" width="16" height="3" fill="#E6215C" />
            <rect x="8" y="41" width="12" height="2" fill="#FF3D6F" />
          </>
        )}

        {/* Bottom-left segment */}
        {bottomLeft && (
          <>
            <rect x="3" y="26" width="3" height="16" fill="#E6215C" />
            <rect x="6" y="28" width="2" height="12" fill="#FF3D6F" />
          </>
        )}

        {/* Top-left segment */}
        {topLeft && (
          <>
            <rect x="3" y="6" width="3" height="16" fill="#E6215C" />
            <rect x="6" y="8" width="2" height="12" fill="#FF3D6F" />
          </>
        )}

        {/* Middle segment */}
        {middle && (
          <>
            <rect x="6" y="22" width="16" height="4" fill="#E6215C" />
            <rect x="8" y="23" width="12" height="2" fill="#FF3D6F" />
          </>
        )}
      </svg>
    </div>
  );
}

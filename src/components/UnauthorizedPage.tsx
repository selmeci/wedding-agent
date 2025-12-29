import { Header } from "./Header";
import { Container } from "./ui";

function GroomWithStopSign({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      {/* Groom */}
      <rect x="8" y="12" width="12" height="2" fill="#2C1810" />
      <rect x="6" y="14" width="16" height="4" fill="#2C1810" />
      <rect x="8" y="18" width="12" height="8" fill="#FFD4A3" />
      <rect x="10" y="20" width="2" height="2" fill="#111827" />
      <rect x="16" y="20" width="2" height="2" fill="#111827" />
      <rect x="12" y="24" width="4" height="1" fill="#111827" />
      <rect x="12" y="26" width="4" height="2" fill="#FFD4A3" />
      <rect x="11" y="28" width="2" height="2" fill="#111827" />
      <rect x="15" y="28" width="2" height="2" fill="#111827" />
      <rect x="13" y="28" width="2" height="2" fill="#FFFFFF" />
      <rect x="8" y="30" width="12" height="6" fill="#1F2937" />
      <rect x="6" y="32" width="16" height="4" fill="#1F2937" />
      <rect x="12" y="30" width="4" height="4" fill="#FFFFFF" />
      <rect x="13" y="31" width="2" height="1" fill="#D1D5DB" />
      <rect x="13" y="33" width="2" height="1" fill="#D1D5DB" />
      <rect x="6" y="30" width="2" height="4" fill="#1F2937" />
      <rect x="4" y="34" width="2" height="2" fill="#FFD4A3" />
      <rect x="20" y="30" width="2" height="4" fill="#1F2937" />
      <rect x="22" y="32" width="8" height="2" fill="#FFD4A3" />
      {/* STOP Sign */}
      <polygon
        points="44,18 50,16 56,18 58,24 56,30 50,32 44,30 42,24"
        fill="#DC2626"
      />
      <polygon
        points="44,18 50,16 56,18 58,24 56,30 50,32 44,30 42,24"
        fill="none"
        stroke="#991B1B"
        strokeWidth="1"
      />
      <polygon
        points="44.5,19 50,17 55.5,19 57,24 55.5,29 50,31 44.5,29 43,24"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="0.5"
      />
      {/* S */}
      <rect x="45" y="21" width="3" height="1" fill="#FFFFFF" />
      <rect x="45" y="22" width="1" height="1" fill="#FFFFFF" />
      <rect x="45" y="23" width="3" height="1" fill="#FFFFFF" />
      <rect x="47" y="24" width="1" height="1" fill="#FFFFFF" />
      <rect x="45" y="25" width="3" height="1" fill="#FFFFFF" />
      {/* T */}
      <rect x="49" y="21" width="3" height="1" fill="#FFFFFF" />
      <rect x="50" y="22" width="1" height="4" fill="#FFFFFF" />
      {/* O */}
      <rect x="45" y="27" width="3" height="1" fill="#FFFFFF" />
      <rect x="45" y="28" width="1" height="3" fill="#FFFFFF" />
      <rect x="47" y="28" width="1" height="3" fill="#FFFFFF" />
      <rect x="45" y="30" width="3" height="1" fill="#FFFFFF" />
      {/* P */}
      <rect x="49" y="27" width="1" height="4" fill="#FFFFFF" />
      <rect x="50" y="27" width="2" height="1" fill="#FFFFFF" />
      <rect x="51" y="28" width="1" height="1" fill="#FFFFFF" />
      <rect x="50" y="29" width="2" height="1" fill="#FFFFFF" />
      {/* Post */}
      <rect x="48" y="32" width="4" height="12" fill="#6B7280" />
      <rect x="46" y="44" width="8" height="2" fill="#4B5563" />
    </svg>
  );
}

export function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 via-white to-pink-100">
      <Header />
      <main className="flex-1 flex items-center justify-center p-8">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <div className="mb-8">
              <GroomWithStopSign className="w-40 h-40 md:w-48 md:h-48 lg:w-64 lg:h-64 mx-auto" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 font-serif">
              Prístup obmedzený
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Táto stránka je momentálne dostupná iba pre pozvaných hostí s QR
              kódom.
            </p>
          </div>
        </Container>
      </main>
    </div>
  );
}

import { Bride, Groom, Heart } from "./PixelArt";
import { Container } from "./ui";

export function Header() {
  return (
    <header className="bg-gradient-pink py-2 md:py-6 shadow-md">
      <Container>
        {/* Mobile: Stacked layout */}
        <div className="md:hidden">
          {/* Pixel art row */}
          <div className="flex items-center justify-center gap-3 mb-2">
            <Bride className="w-12 h-12" />
            <Heart className="w-8 h-8" animated />
            <Groom className="w-12 h-12" />
          </div>
          {/* Names */}
          <h1 className="text-xl font-bold text-white text-center">
            Ivonka & Roman
          </h1>
          {/* Date */}
          <p className="text-center text-white/90 mt-1 text-xs">
            27. marec 2026 · Modra
          </p>
        </div>

        {/* Desktop: Single row with pixel art */}
        <div className="hidden md:flex items-center justify-center gap-4">
          <Bride className="w-16 h-16 lg:w-20 lg:h-20" />
          <Heart className="w-10 h-10 lg:w-12 lg:h-12" animated />
          <div className="text-center">
            <h1 className="text-3xl lg:text-4xl font-bold text-white">
              Ivonka & Roman
            </h1>
            <p className="text-white/90 mt-1 text-sm lg:text-base">
              27. marec 2026 · Modra
            </p>
          </div>
          <Heart className="w-10 h-10 lg:w-12 lg:h-12" animated />
          <Groom className="w-16 h-16 lg:w-20 lg:h-20" />
        </div>
      </Container>
    </header>
  );
}

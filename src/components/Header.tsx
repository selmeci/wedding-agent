import { Bride, Groom, Heart } from "./PixelArt";
import { Container } from "./ui";

export function Header() {
	return (
		<header className="bg-gradient-pink py-2 md:py-6 shadow-md">
			<Container>
				{/* Extra small screens ONLY: Stacked layout (pod 340px) */}
				<div className="min-[340px]:hidden">
					<div className="flex items-center justify-center gap-1 mb-1.5">
						<Bride className="w-9 h-9" />
						<Heart className="w-5 h-5" animated />
						<Groom className="w-9 h-9" />
					</div>
					<h1 className="text-base font-bold text-white text-center">
						Ivonka & Roman
					</h1>
					<p className="text-center text-white/90 mt-0.5 text-xs">
						27. marca 2026 · Modra
					</p>
				</div>

				{/* Small to large screens: Horizontal layout (od 340px) */}
				<div className="hidden min-[340px]:flex items-center justify-center gap-1 sm:gap-2 md:gap-3">
					<Bride className="w-9 h-9 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20" />
					<Heart
						className="w-5 h-5 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
						animated
					/>
					<div className="text-center">
						<h1 className="text-base sm:text-xl md:text-3xl lg:text-4xl font-bold text-white">
							Ivonka & Roman
						</h1>
						<p className="text-white/90 mt-0.5 sm:mt-1 text-xs sm:text-sm lg:text-base">
							27. marca 2026 · Modra
						</p>
					</div>
					<Heart
						className="w-5 h-5 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
						animated
					/>
					<Groom className="w-9 h-9 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20" />
				</div>
			</Container>
		</header>
	);
}

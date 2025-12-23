import { Heart } from "./PixelArt";
import { Container } from "./ui";

export function Header() {
	return (
		<header className="bg-gradient-pink py-6 shadow-md">
			<Container>
				<div className="flex items-center justify-center gap-4">
					<Heart className="w-8 h-8" animated />
					<h1 className="text-3xl md:text-4xl font-bold text-white text-center">
						Ivonka & Roman
					</h1>
					<Heart className="w-8 h-8" animated />
				</div>
				<p className="text-center text-white/90 mt-2 text-sm md:text-base">
					27. marec 2026 · Modra
				</p>
			</Container>
		</header>
	);
}

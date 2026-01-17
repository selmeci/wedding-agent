interface GiftBoxProps {
	className?: string;
	animated?: boolean;
}

export function GiftBox({ className = "", animated = false }: GiftBoxProps) {
	return (
		<svg
			width="128"
			height="128"
			viewBox="0 0 128 128"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
			style={{ imageRendering: "pixelated" }}
		>
			{/* === METALLIC GOLD RIBBON BOW (5-level gradient) === */}
			{/*
				Level 1 (darkest): #8B6914 (deep gold shadow)
				Level 2 (dark):    #B8860B (dark gold)
				Level 3 (base):    #DAA520 (goldenrod)
				Level 4 (light):   #FFD700 (gold)
				Level 5 (highlight): #FFF8DC (cornsilk/white gold)
			*/}

			{/* === BOW TOP CENTER LOOPS === */}
			{/* Left loop base */}
			<rect x="48" y="20" width="12" height="12" fill="#FFD700" />
			<rect x="50" y="22" width="8" height="8" fill="#FFEC80" />
			<rect x="52" y="24" width="4" height="4" fill="#FFF8DC" />
			{/* Left loop depth */}
			<rect x="48" y="28" width="4" height="4" fill="#DAA520" />
			<rect x="48" y="20" width="2" height="10" fill="#B8860B" opacity="0.6" />

			{/* Right loop base */}
			<rect x="68" y="20" width="12" height="12" fill="#FFD700" />
			<rect x="70" y="22" width="8" height="8" fill="#FFEC80" />
			<rect x="72" y="24" width="4" height="4" fill="#FFF8DC" />
			{/* Right loop depth */}
			<rect x="76" y="28" width="4" height="4" fill="#DAA520" />
			<rect x="78" y="20" width="2" height="10" fill="#B8860B" opacity="0.6" />

			{/* === BOW TAILS (hanging ribbons) === */}
			{/* Left tail with metallic gradient */}
			<rect x="36" y="28" width="12" height="14" fill="#FFD700" />
			<rect x="38" y="30" width="6" height="10" fill="#FFEC80" />
			<rect x="40" y="32" width="2" height="6" fill="#FFF8DC" />
			<rect x="44" y="30" width="4" height="10" fill="#DAA520" />
			<rect x="46" y="32" width="2" height="8" fill="#B8860B" opacity="0.5" />
			{/* Tail point */}
			<rect x="38" y="42" width="8" height="4" fill="#DAA520" />
			<rect x="40" y="44" width="4" height="2" fill="#B8860B" />

			{/* Right tail with metallic gradient */}
			<rect x="80" y="28" width="12" height="14" fill="#FFD700" />
			<rect x="82" y="30" width="6" height="10" fill="#FFEC80" />
			<rect x="84" y="32" width="2" height="6" fill="#FFF8DC" />
			<rect x="80" y="30" width="4" height="10" fill="#DAA520" />
			<rect x="80" y="32" width="2" height="8" fill="#B8860B" opacity="0.5" />
			{/* Tail point */}
			<rect x="82" y="42" width="8" height="4" fill="#DAA520" />
			<rect x="84" y="44" width="4" height="2" fill="#B8860B" />

			{/* === BOW KNOT CENTER (3D bulge) === */}
			<rect x="56" y="24" width="16" height="12" fill="#FFD700" />
			<rect x="58" y="26" width="12" height="8" fill="#FFEC80" />
			<rect x="60" y="28" width="8" height="4" fill="#FFF8DC" />
			{/* Knot shadow */}
			<rect x="56" y="32" width="16" height="4" fill="#DAA520" />
			<rect x="58" y="34" width="4" height="2" fill="#B8860B" />
			<rect x="66" y="34" width="4" height="2" fill="#B8860B" />
			{/* Knot highlight */}
			<rect x="62" y="26" width="4" height="2" fill="#FFFFFF" opacity="0.6" />

			{/* === 1px METALLIC SHINE LINES ON BOW === */}
			<rect x="51" y="23" width="1" height="6" fill="#FFF8DC" opacity="0.8" />
			<rect x="71" y="23" width="1" height="6" fill="#FFF8DC" opacity="0.8" />
			<rect x="39" y="31" width="1" height="8" fill="#FFF8DC" opacity="0.7" />
			<rect x="85" y="31" width="1" height="8" fill="#FFF8DC" opacity="0.7" />
			<rect x="61" y="27" width="1" height="4" fill="#FFFFFF" opacity="0.9" />

			{/* === BOX LID TOP (5-level pink gradient) === */}
			<rect x="32" y="40" width="64" height="8" fill="#FF69B4" />
			{/* Lid gradient layers */}
			<rect x="34" y="41" width="28" height="6" fill="#FF85C1" />
			<rect x="36" y="42" width="20" height="4" fill="#FF9DD0" />
			<rect x="38" y="43" width="12" height="2" fill="#FFBDE0" />
			{/* Lid shadow */}
			<rect x="70" y="42" width="22" height="4" fill="#FF4DAA" opacity="0.5" />

			{/* === HORIZONTAL RIBBON ON LID (metallic gold) === */}
			<rect x="32" y="48" width="64" height="8" fill="#FFD700" />
			{/* 5-level gradient across ribbon */}
			<rect x="34" y="49" width="60" height="4" fill="#FFEC80" />
			<rect x="36" y="50" width="56" height="2" fill="#FFF8DC" />
			<rect x="38" y="51" width="1" height="1" fill="#FFFFFF" opacity="0.8" />
			{/* Ribbon shadow at edges */}
			<rect x="32" y="54" width="64" height="2" fill="#DAA520" />
			<rect x="34" y="55" width="4" height="1" fill="#B8860B" opacity="0.6" />
			<rect x="88" y="55" width="4" height="1" fill="#B8860B" opacity="0.6" />
			{/* 1px metallic shine lines */}
			<rect x="40" y="50" width="1" height="4" fill="#FFF8DC" opacity="0.9" />
			<rect x="52" y="50" width="1" height="4" fill="#FFF8DC" opacity="0.8" />
			<rect x="76" y="50" width="1" height="4" fill="#FFF8DC" opacity="0.7" />

			{/* === LID BODY (5-level pink gradient) === */}
			{/*
				Level 1 (darkest): #8B0045
				Level 2 (dark):    #C71585
				Level 3 (base):    #FF1493
				Level 4 (light):   #FF69B4
				Level 5 (highlight): #FFBDE0
			*/}
			<rect x="24" y="56" width="80" height="8" fill="#FF1493" />
			<rect x="24" y="64" width="80" height="8" fill="#FF69B4" />
			{/* Lid gradient layers */}
			<rect x="26" y="57" width="36" height="6" fill="#FF3DA5" />
			<rect x="28" y="58" width="28" height="4" fill="#FF54B0" />
			<rect x="30" y="59" width="16" height="2" fill="#FF85C1" />
			<rect x="26" y="65" width="36" height="5" fill="#FF85C1" />
			<rect x="28" y="66" width="28" height="3" fill="#FF9DD0" />
			{/* Lid right shadow */}
			<rect x="80" y="58" width="20" height="4" fill="#C71585" opacity="0.5" />
			<rect x="80" y="66" width="20" height="4" fill="#FF4DAA" opacity="0.4" />

			{/* === MAIN BOX BODY (5-level pink gradient) === */}
			<rect x="28" y="72" width="72" height="40" fill="#FF1493" />
			{/* Left side highlight gradient */}
			<rect x="30" y="74" width="24" height="36" fill="#FF3DA5" />
			<rect x="32" y="76" width="18" height="32" fill="#FF54B0" />
			<rect x="34" y="78" width="12" height="28" fill="#FF69B4" />
			<rect x="36" y="80" width="6" height="24" fill="#FF85C1" opacity="0.7" />
			{/* 1px highlight lines */}
			<rect x="35" y="80" width="1" height="20" fill="#FF9DD0" opacity="0.8" />
			<rect x="38" y="82" width="1" height="16" fill="#FFBDE0" opacity="0.6" />
			{/* Right side shadow gradient */}
			<rect x="80" y="74" width="16" height="36" fill="#C71585" opacity="0.4" />
			<rect x="88" y="76" width="8" height="32" fill="#A0126B" opacity="0.3" />

			{/* === VERTICAL RIBBON (metallic gold - 5-level gradient) === */}
			<rect x="56" y="72" width="16" height="40" fill="#FFD700" />
			{/* Metallic gradient layers */}
			<rect x="57" y="73" width="14" height="38" fill="#FFEC80" />
			<rect x="58" y="74" width="10" height="36" fill="#FFF0B0" />
			<rect x="60" y="76" width="6" height="32" fill="#FFF8DC" />
			<rect x="62" y="78" width="2" height="28" fill="#FFFFFF" opacity="0.5" />
			{/* Right edge shadow */}
			<rect x="68" y="72" width="4" height="40" fill="#DAA520" />
			<rect x="70" y="74" width="2" height="36" fill="#B8860B" opacity="0.6" />
			{/* Left edge shadow */}
			<rect x="56" y="74" width="2" height="36" fill="#DAA520" opacity="0.5" />
			{/* 1px metallic shine lines */}
			<rect x="59" y="76" width="1" height="32" fill="#FFFFFF" opacity="0.7" />
			<rect x="61" y="78" width="1" height="28" fill="#FFFFFF" opacity="0.9" />
			<rect x="63" y="80" width="1" height="24" fill="#FFFFFF" opacity="0.6" />

			{/* === BOX BOTTOM EDGE (deep shadow) === */}
			<rect x="32" y="112" width="64" height="8" fill="#C71585" />
			<rect x="34" y="114" width="60" height="4" fill="#A0126B" />
			<rect x="36" y="116" width="56" height="2" fill="#8B0045" />

			{/* === SHADOW/DEPTH === */}
			<rect x="96" y="72" width="8" height="40" fill="#C71585" />
			<rect x="28" y="112" width="72" height="8" fill="#8B0045" />
			{/* Extra depth on right */}
			<rect x="98" y="74" width="4" height="36" fill="#A0126B" />
			<rect x="100" y="76" width="2" height="32" fill="#8B0045" opacity="0.7" />
			{/* 1px depth lines */}
			<rect x="97" y="76" width="1" height="32" fill="#8B0045" opacity="0.5" />

			{/* === DECORATIVE PATTERNS (polka dots with gradients) === */}
			{/* Left side dots */}
			<rect x="36" y="84" width="4" height="4" fill="#FF85C1" />
			<rect x="37" y="85" width="2" height="2" fill="#FFBDE0" />
			<rect x="44" y="92" width="4" height="4" fill="#FF85C1" />
			<rect x="45" y="93" width="2" height="2" fill="#FFBDE0" />
			<rect x="36" y="100" width="4" height="4" fill="#FF85C1" />
			<rect x="37" y="101" width="2" height="2" fill="#FFBDE0" />
			{/* Right side dots */}
			<rect x="80" y="84" width="4" height="4" fill="#FF54B0" />
			<rect x="81" y="85" width="2" height="2" fill="#FF85C1" />
			<rect x="88" y="92" width="4" height="4" fill="#FF54B0" />
			<rect x="89" y="93" width="2" height="2" fill="#FF85C1" />
			<rect x="80" y="100" width="4" height="4" fill="#FF54B0" />
			<rect x="81" y="101" width="2" height="2" fill="#FF85C1" />

			{/* === ENHANCED SPARKLE EFFECTS === */}
			<g opacity="0.9">
				{/* Top sparkle near bow (4-point star) */}
				<rect x="44" y="14" width="4" height="4" fill="#FFFFFF" />
				<rect x="42" y="16" width="2" height="8" fill="#FFFFFF" opacity="0.6" />
				<rect x="38" y="18" width="10" height="2" fill="#FFFFFF" opacity="0.6" />
				<rect x="44" y="12" width="2" height="2" fill="#FFFFFF" opacity="0.4" />
				<rect x="44" y="22" width="2" height="2" fill="#FFFFFF" opacity="0.4" />

				{/* Right side sparkle */}
				<rect x="106" y="58" width="4" height="4" fill="#FFFFFF" />
				<rect x="108" y="56" width="2" height="8" fill="#FFFFFF" opacity="0.5" />
				<rect x="104" y="60" width="8" height="2" fill="#FFFFFF" opacity="0.5" />

				{/* Small accent sparkles on bow */}
				<rect x="52" y="23" width="2" height="2" fill="#FFFFFF" />
				<rect x="74" y="23" width="2" height="2" fill="#FFFFFF" opacity="0.9" />
				<rect x="63" y="26" width="2" height="2" fill="#FFFFFF" opacity="0.8" />

				{/* Box surface sparkles */}
				<rect x="34" y="60" width="2" height="2" fill="#FFFFFF" opacity="0.7" />
				<rect x="42" y="78" width="2" height="2" fill="#FFFFFF" opacity="0.5" />
				<rect x="92" y="80" width="2" height="2" fill="#FFFFFF" opacity="0.4" />
			</g>

			{/* === ANTI-ALIASED EDGES === */}
			{/* Box left edge */}
			<rect x="27" y="74" width="1" height="36" fill="#FF1493" opacity="0.5" />
			<rect x="26" y="76" width="1" height="32" fill="#FF1493" opacity="0.25" />
			{/* Box right edge */}
			<rect x="100" y="74" width="1" height="36" fill="#C71585" opacity="0.5" />
			<rect x="101" y="76" width="1" height="32" fill="#8B0045" opacity="0.25" />
			{/* Box bottom edge */}
			<rect x="30" y="120" width="68" height="1" fill="#8B0045" opacity="0.4" />

			{/* === METALLIC RIBBON REFLECTIONS === */}
			{/* Horizontal ribbon reflection */}
			<rect x="42" y="51" width="8" height="1" fill="#FFFFFF" opacity="0.5" />
			<rect x="64" y="51" width="8" height="1" fill="#FFFFFF" opacity="0.4" />
			{/* Vertical ribbon reflections */}
			<rect x="60" y="82" width="4" height="2" fill="#FFFFFF" opacity="0.3" />
			<rect x="60" y="94" width="4" height="2" fill="#FFFFFF" opacity="0.25" />
			<rect x="60" y="106" width="4" height="2" fill="#FFFFFF" opacity="0.2" />

			{/* === BOX CORNER HIGHLIGHT === */}
			<rect x="28" y="72" width="4" height="4" fill="#FF9DD0" opacity="0.6" />
			<rect x="29" y="73" width="2" height="2" fill="#FFBDE0" opacity="0.4" />

			{animated && (
				<style>
					{`
            @keyframes gift-float {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-4px); }
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

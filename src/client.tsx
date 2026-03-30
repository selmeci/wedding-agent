import "./styles.css";
import { createRoot } from "react-dom/client";
import { GalleryPage } from "@/components/Gallery";
import { UnauthorizedPage } from "@/components/UnauthorizedPage";
import { Providers } from "@/providers";
import App from "./app";

// Check for QR token authorization
function checkAuthorization() {
	const urlParams = new URLSearchParams(window.location.search);
	const qrToken = urlParams.get("qrToken");

	// Check cookie as well
	const cookies = document.cookie.split(";");
	const qrTokenCookie = cookies.find((c) => c.trim().startsWith("qr_token="));

	return !!(qrToken || qrTokenCookie);
}

// Returns the gallery token if on /gallery path, null otherwise
function getGalleryToken(): string | null {
	if (window.location.pathname !== "/gallery") return null;
	return new URLSearchParams(window.location.search).get("token");
}

// biome-ignore lint/style/noNonNullAssertion: It is ok here
const root = createRoot(document.getElementById("app")!);

function AppRoot() {
	// DEBUG: Log routing decision
	console.log("[Gallery Debug] pathname:", window.location.pathname);
	console.log("[Gallery Debug] search:", window.location.search);
	console.log("[Gallery Debug] full href:", window.location.href);

	// Gallery route: /gallery?token=...
	const galleryToken = getGalleryToken();
	console.log("[Gallery Debug] getGalleryToken() returned:", galleryToken);

	if (galleryToken !== null) {
		console.log("[Gallery Debug] Rendering GalleryPage");
		return <GalleryPage token={galleryToken} />;
	}

	// Normal app route
	const isAuthorized = checkAuthorization();
	console.log("[Gallery Debug] checkAuthorization() returned:", isAuthorized);
	return isAuthorized ? <App /> : <UnauthorizedPage />;
}

root.render(
	<Providers>
		<div className="bg-neutral-50 text-base text-neutral-900 antialiased transition-colors selection:bg-blue-700 selection:text-white dark:bg-neutral-950 dark:text-neutral-100">
			<AppRoot />
		</div>
	</Providers>,
);

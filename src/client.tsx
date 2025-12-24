import "./styles.css";
import { createRoot } from "react-dom/client";
import App from "./app";
import { Providers } from "@/providers";

// Check for QR token authorization before rendering React app
function checkAuthorization() {
  const urlParams = new URLSearchParams(window.location.search);
  const qrToken = urlParams.get("qrToken");

  // Check cookie as well
  const cookies = document.cookie.split(";");
  const qrTokenCookie = cookies.find((c) => c.trim().startsWith("qr_token="));

  // If no token in URL or cookie, redirect to 401 page
  if (!qrToken && !qrTokenCookie) {
    window.location.href = "/401.html";
    return false;
  }

  return true;
}

// Only render if authorized
if (checkAuthorization()) {
  const root = createRoot(document.getElementById("app")!);

  root.render(
    <Providers>
      <div className="bg-neutral-50 text-base text-neutral-900 antialiased transition-colors selection:bg-blue-700 selection:text-white dark:bg-neutral-950 dark:text-neutral-100">
        <App />
      </div>
    </Providers>
  );
}

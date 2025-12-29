import "./styles.css";
import { createRoot } from "react-dom/client";
import App from "./app";
import { Providers } from "@/providers";
import { UnauthorizedPage } from "@/components/UnauthorizedPage";

// Check for QR token authorization
function checkAuthorization() {
  const urlParams = new URLSearchParams(window.location.search);
  const qrToken = urlParams.get("qrToken");

  // Check cookie as well
  const cookies = document.cookie.split(";");
  const qrTokenCookie = cookies.find((c) => c.trim().startsWith("qr_token="));

  return !!(qrToken || qrTokenCookie);
}

const root = createRoot(document.getElementById("app")!);
const isAuthorized = checkAuthorization();

root.render(
  <Providers>
    <div className="bg-neutral-50 text-base text-neutral-900 antialiased transition-colors selection:bg-blue-700 selection:text-white dark:bg-neutral-950 dark:text-neutral-100">
      {isAuthorized ? <App /> : <UnauthorizedPage />}
    </div>
  </Providers>
);

import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";

// QR code plugin for dev mode - prints network URL as QR code
function qrCodePlugin(): Plugin {
  return {
    name: "vite-plugin-qr-code",
    apply: "serve",
    configureServer(server) {
      server.httpServer?.once("listening", async () => {
        const address = server.httpServer?.address();
        if (!address || typeof address === "string") return;

        // Find network address
        const { networkInterfaces } = await import("node:os");
        const nets = networkInterfaces();
        let networkUrl: string | null = null;

        for (const name of Object.keys(nets)) {
          for (const net of nets[name] ?? []) {
            // Skip internal and non-IPv4 addresses
            if (net.family === "IPv4" && !net.internal) {
              networkUrl = `http://${net.address}:${address.port}`;
              break;
            }
          }
          if (networkUrl) break;
        }

        if (networkUrl) {
          // Dynamic import to avoid issues in production build
          const qrcode = await import("qrcode-terminal");
          console.log("\n  📱 Scan QR code to open on mobile:\n");
          qrcode.default.generate(networkUrl, { small: true }, (code: string) => {
            console.log(code);
            console.log(`  ${networkUrl}\n`);
          });
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [cloudflare(), react(), tailwindcss(), qrCodePlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // allow localhost + network access
    port: 5173,
    cors: true, // enable CORS globally
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "fb2bc3602c20.ngrok-free.app",
      "ngrok.io",
    ],
  },
  preview: {
    port: 4173,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "ngrok-free.app",
      "ngrok.io",
    ],
  },
});
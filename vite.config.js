import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(() => ({
  define: {
    SOCKET_URI: process.env.SOCKET_URI,
  },
  build: {
    outDir: "dist",
  },
  plugins: [react()],
}));

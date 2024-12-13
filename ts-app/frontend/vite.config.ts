import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    host: "0.0.0.0", // Listen on all network interfaces
    strictPort: true,
    watch: {
      usePolling: true,
    },
  },
})

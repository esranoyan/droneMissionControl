import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      // Browser polyfills
      stream: 'stream-browserify',
      util: 'util',
    }
  },
  optimizeDeps: {
    exclude: ['pg'] // pg paketini optimize etme
  }
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Listen on every address in the workspace so GitHub Codespaces can forward the port.
    host: true,
    port: 5173,
    strictPort: true,
    // Lets the preview load through GitHub Codespaces' forwarded address.
    allowedHosts: ['.app.github.dev'],
  },
});

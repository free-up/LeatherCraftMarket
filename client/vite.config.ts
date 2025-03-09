// client/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // ← Добавьте эту строку

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../shared') // Убедитесь, что путь корректен
    }
  },
  server: {
    port: 3000
  }
});
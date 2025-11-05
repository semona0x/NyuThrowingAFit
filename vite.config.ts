import { defineConfig, PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import { reactComponentTagger } from 'react-component-tagger';

export default defineConfig({
  plugins: [
    react(),
    reactComponentTagger() as PluginOption,
  ],
  build: {
    chunkSizeWarningLimit: 10240,
  },
});

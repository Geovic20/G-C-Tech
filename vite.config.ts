import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

// NOTE: do not add a `define` entry for a secret. `define` performs a literal
// text substitution in the bundle that ships to the browser, and unlike
// `import.meta.env`, it ignores the VITE_ prefix rule — so any variable named
// there becomes public. Client-readable config goes through VITE_* env vars;
// anything secret belongs in a Supabase Edge Function secret.
export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});

import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// Plugin to handle figma:asset imports during build
function figmaAssetPlugin() {
  const PREFIX = 'figma:asset/';
  return {
    name: 'figma-asset-plugin',
    enforce: 'pre' as const, // Run before other plugins
    resolveId(id: string) {
      if (id.startsWith(PREFIX)) {
        // Return a resolved virtual module ID
        return '\0' + id; // \0 prefix marks it as virtual module
      }
    },
    load(id: string) {
      if (id.startsWith('\0' + PREFIX)) {
        // Return inline SVG logo as data URL
        const logo = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='60' viewBox='0 0 200 60'%3E%3Ctext x='10' y='40' font-family='Work Sans, sans-serif' font-size='24' font-weight='700' fill='%23131718'%3ECreator Pricing%3C/text%3E%3C/svg%3E`;
        return `export default "${logo}"`;
      }
    }
  };
}

export default defineConfig({
  plugins: [
    figmaAssetPlugin(), // Must be before react plugin
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being activated – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Explicitly configure the public directory
  publicDir: 'public',
})
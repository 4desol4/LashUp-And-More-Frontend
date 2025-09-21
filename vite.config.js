import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/pages": path.resolve(__dirname, "./src/pages"),
      "@/hooks": path.resolve(__dirname, "./src/hooks"),
      "@/services": path.resolve(__dirname, "./src/services"),
      "@/utils": path.resolve(__dirname, "./src/utils"),
      "@/context": path.resolve(__dirname, "./src/context"),
      "@/styles": path.resolve(__dirname, "./src/styles"),
    },
  },
  server: {
    port: 3000,
    host: true,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,

    cssCodeSplit: false,
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          motion: ["framer-motion"],
          icons: ["react-icons"],
        },

        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split(".");
          const extType = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return `img/[name]-[hash][extname]`;
          }
          if (extType === "css") {
            return `css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },

    target: "es2015",
  },
  css: {
    postcss: "./postcss.config.js",

    devSourcemap: true,
    preprocessorOptions: {
      css: {
        charset: false,
      },
    },
  },

  optimizeDeps: {
    exclude: [],
 
    include: ["tailwindcss", "autoprefixer"],
  },


  esbuild: {
    keepNames: true,
  },
});

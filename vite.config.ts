import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import seoPrerender from "./vite-plugin-seo";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Adresse publique du site (liens absolus du SEO). Repli : domaine de
  // production fourni par Vercel au moment du build.
  const env = loadEnv(mode, process.cwd(), "");
  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const siteUrl = (env.VITE_SITE_URL || (vercelUrl ? `https://${vercelUrl}` : "")).replace(/\/+$/, "");
  const alias = { "@": path.resolve(__dirname, "./src") };

  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    plugins: [react(), mode === "development" && componentTagger(), seoPrerender({ siteUrl, alias })].filter(Boolean),
    define: { "import.meta.env.VITE_SITE_URL": JSON.stringify(siteUrl) },
    // Encodeur WebP (WebAssembly) : ne pas pré-optimiser, sinon Vite ne trouve
    // plus le fichier .wasm en développement.
    optimizeDeps: {
      exclude: ["@jsquash/webp"],
    },
    // Workers en modules ES : le worker d'encodage WebP charge son wasm à la demande.
    worker: {
      format: "es",
    },
    resolve: {
      alias,
      dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
    },
  };
});

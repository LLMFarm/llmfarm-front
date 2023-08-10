import { defineConfig, loadEnv } from "vite";
const env = loadEnv("development", process.cwd());
import path from "path";
import vue from "@vitejs/plugin-vue";
import prismjs from "vite-plugin-prismjs";
import { viteStaticCopy } from 'vite-plugin-static-copy'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    prismjs.default({
      languages: ["sql", "js", "json", "md"],
      plugins: ["line-numbers"],
      theme: "okaidia", //主题名称
      css: true,
    }),
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/@paodingai/pdflux-pdf-viewer/dist/*',
          // 注意 dest 要和 resourcePath 对应
          dest: 'pdflux-pdf-viewer',
        }
      ]
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "~@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: env.VITE_SERVER_PORT || 5173,
    proxy: {
      "/api": {
        target: env.VITE_SERVICE_URL || "http://127.0.0.1:8000",
        // target: env.VITE_SERVICE_URL || "http://20.196.223.141:4005",
        protocol: "http",
        changeOrigin: true,
        ws: true,
      },
      "/chain/api": {
        target: env.VITE_CHAINFLOW_URL || "http://54.251.195.63:4010",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/chain\/api/, "/api"),
      },
    },
  },
});

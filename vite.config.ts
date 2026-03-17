import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from "fs";
import type { IncomingMessage, ServerResponse } from "http";

const DB_PATH = path.resolve(__dirname, "./src/data/pages.json");

function jsonDbPlugin(): Plugin {
  return {
    name: "json-db",
    configureServer(server) {
      server.middlewares.use(
        "/api/pages",
        (req: IncomingMessage, res: ServerResponse) => {
          res.setHeader("Content-Type", "application/json");
          res.setHeader("Access-Control-Allow-Origin", "*");

          if (req.method === "GET") {
            try {
              const data = fs.readFileSync(DB_PATH, "utf-8");
              res.statusCode = 200;
              res.end(data);
            } catch {
              res.statusCode = 200;
              res.end("{}");
            }
            return;
          }

          if (req.method === "POST") {
            let body = "";
            req.on("data", (chunk) => (body += chunk));
            req.on("end", () => {
              try {
                // Validate JSON before writing
                const parsed = JSON.parse(body);
                fs.writeFileSync(DB_PATH, JSON.stringify(parsed, null, 2));
                res.statusCode = 200;
                res.end('{"ok":true}');
              } catch (e) {
                console.error("[json-db] Failed to save:", e);
                res.statusCode = 500;
                res.end('{"error":"Failed to save"}');
              }
            });
            return;
          }

          res.statusCode = 405;
          res.end('{"error":"Method not allowed"}');
        }
      );
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    mode === "development" && jsonDbPlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

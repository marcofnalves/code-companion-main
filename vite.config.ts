import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";
import type { IncomingMessage, ServerResponse } from "http";

const PROJECTS_LIST_PATH = path.resolve(__dirname, "./src/data/projects-list.json");
const PROJECTS_DIR      = path.resolve(__dirname, "./src/data/projects");

// ── Helpers ──────────────────────────────────────────────────────────────────

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function readProjects() {
  try { return JSON.parse(fs.readFileSync(PROJECTS_LIST_PATH, "utf-8")); }
  catch { return []; }
}

function getQueryParam(url: string, key: string): string | null {
  try {
    return new URL(url, "http://localhost").searchParams.get(key);
  } catch { return null; }
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => resolve(body));
  });
}

// ── Plugin ───────────────────────────────────────────────────────────────────

function jsonDbPlugin(): Plugin {
  return {
    name: "json-db",
    configureServer(server) {
      // Garantir que a pasta de projetos existe
      if (!fs.existsSync(PROJECTS_DIR))
        fs.mkdirSync(PROJECTS_DIR, { recursive: true });
      if (!fs.existsSync(PROJECTS_LIST_PATH))
        fs.writeFileSync(PROJECTS_LIST_PATH, "[]");

      // ── /api/projects ─────────────────────────────────────────────────────
      server.middlewares.use(
        "/api/projects",
        async (req: IncomingMessage, res: ServerResponse) => {
          res.setHeader("Content-Type", "application/json");
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
          res.setHeader("Access-Control-Allow-Headers", "Content-Type");

          if (req.method === "OPTIONS") { res.statusCode = 204; res.end(); return; }

          const id = getQueryParam(req.url ?? "", "id");

          // GET — lista de projetos
          if (req.method === "GET") {
            res.statusCode = 200;
            res.end(JSON.stringify(readProjects()));
            return;
          }

          // POST — criar projeto
          if (req.method === "POST") {
            const body = await readBody(req);
            try {
              const { name } = JSON.parse(body);
              const projects = readProjects();
              const base = slugify(name) || "projeto";
              let newId = base;
              let n = 1;
              while (projects.find((p: { id: string }) => p.id === newId))
                newId = `${base}-${n++}`;
              const project = { id: newId, name, createdAt: new Date().toISOString() };
              projects.push(project);
              fs.writeFileSync(PROJECTS_LIST_PATH, JSON.stringify(projects, null, 2));
              fs.writeFileSync(
                path.join(PROJECTS_DIR, `${newId}.json`),
                JSON.stringify({ navigation: [], pages: {} }, null, 2)
              );
              res.statusCode = 200;
              res.end(JSON.stringify(project));
            } catch {
              res.statusCode = 500;
              res.end('{"error":"Falha ao criar projeto"}');
            }
            return;
          }

          // PATCH — renomear projeto
          if (req.method === "PATCH" && id) {
            const body = await readBody(req);
            try {
              const { name } = JSON.parse(body);
              const projects = readProjects().map((p: { id: string }) =>
                p.id === id ? { ...p, name } : p
              );
              fs.writeFileSync(PROJECTS_LIST_PATH, JSON.stringify(projects, null, 2));
              res.statusCode = 200;
              res.end('{"ok":true}');
            } catch {
              res.statusCode = 500;
              res.end('{"error":"Falha ao renomear"}');
            }
            return;
          }

          // DELETE — apagar projeto
          if (req.method === "DELETE" && id) {
            try {
              const projects = readProjects().filter(
                (p: { id: string }) => p.id !== id
              );
              fs.writeFileSync(PROJECTS_LIST_PATH, JSON.stringify(projects, null, 2));
              const file = path.join(PROJECTS_DIR, `${id}.json`);
              if (fs.existsSync(file)) fs.unlinkSync(file);
              res.statusCode = 200;
              res.end('{"ok":true}');
            } catch {
              res.statusCode = 500;
              res.end('{"error":"Falha ao apagar"}');
            }
            return;
          }

          res.statusCode = 405;
          res.end('{"error":"Método não permitido"}');
        }
      );

      // ── /api/pages ────────────────────────────────────────────────────────
      server.middlewares.use(
        "/api/pages",
        async (req: IncomingMessage, res: ServerResponse) => {
          res.setHeader("Content-Type", "application/json");
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
          res.setHeader("Access-Control-Allow-Headers", "Content-Type");

          if (req.method === "OPTIONS") { res.statusCode = 204; res.end(); return; }

          const projectId = getQueryParam(req.url ?? "", "project");
          if (!projectId) {
            res.statusCode = 400;
            res.end('{"error":"Parâmetro project obrigatório"}');
            return;
          }

          const dbPath = path.join(PROJECTS_DIR, `${projectId}.json`);

          if (req.method === "GET") {
            try {
              res.statusCode = 200;
              res.end(fs.existsSync(dbPath) ? fs.readFileSync(dbPath, "utf-8") : "{}");
            } catch {
              res.statusCode = 200;
              res.end("{}");
            }
            return;
          }

          if (req.method === "POST") {
            const body = await readBody(req);
            try {
              const parsed = JSON.parse(body);
              fs.writeFileSync(dbPath, JSON.stringify(parsed, null, 2));
              res.statusCode = 200;
              res.end('{"ok":true}');
            } catch (e) {
              console.error("[json-db] Falha ao guardar:", e);
              res.statusCode = 500;
              res.end('{"error":"Falha ao guardar"}');
            }
            return;
          }

          res.statusCode = 405;
          res.end('{"error":"Método não permitido"}');
        }
      );
    },
  };
}

// ── Plugin: copia PHP para dist/ no build ─────────────────────────────────────

function copyPhpPlugin(): Plugin {
  return {
    name: "copy-php",
    closeBundle() {
      const distDir = path.resolve(__dirname, "dist");

      // api.php → dist/api/api.php
      const apiDir = path.join(distDir, "api");
      if (!fs.existsSync(apiDir)) fs.mkdirSync(apiDir, { recursive: true });
      const apiSrc = path.resolve(__dirname, "api.php");
      if (fs.existsSync(apiSrc)) {
        fs.copyFileSync(apiSrc, path.join(apiDir, "api.php"));
        console.log("[copy-php] api.php → dist/api/api.php");
      }

      // projects-list.json → dist/api/projects-list.json
      const projectsListSrc = path.resolve(__dirname, "src/data/projects-list.json");
      if (fs.existsSync(projectsListSrc)) {
        fs.copyFileSync(projectsListSrc, path.join(apiDir, "projects-list.json"));
        console.log("[copy-php] projects-list.json → dist/api/projects-list.json");
      }

      // src/data/projects/*.json → dist/api/projects/*.json
      const projectsSrcDir = path.resolve(__dirname, "src/data/projects");
      const projectsDestDir = path.join(apiDir, "projects");
      if (fs.existsSync(projectsSrcDir)) {
        if (!fs.existsSync(projectsDestDir)) fs.mkdirSync(projectsDestDir, { recursive: true });
        for (const file of fs.readdirSync(projectsSrcDir)) {
          if (file.endsWith(".json")) {
            fs.copyFileSync(
              path.join(projectsSrcDir, file),
              path.join(projectsDestDir, file)
            );
            console.log(`[copy-php] projects/${file} → dist/api/projects/${file}`);
          }
        }
      }

      // docsSystem.htaccess → dist/.htaccess (SPA routing no InfinityFree)
      const htaccessSrc = path.resolve(__dirname, "docsSystem.htaccess");
      if (fs.existsSync(htaccessSrc)) {
        fs.copyFileSync(htaccessSrc, path.join(distDir, ".htaccess"));
        console.log("[copy-php] docsSystem.htaccess → dist/.htaccess");
      }
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
  // Caminhos relativos — funciona em qualquer sub-pasta sem configuração extra
  base: "./",
  plugins: [
    react(),
    mode === "development" && jsonDbPlugin(),
    mode === "production" && copyPhpPlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

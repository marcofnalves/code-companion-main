# DOCS System

Sistema de documentação interno com CMS integrado.

## Desenvolvimento

```bash
npm install
npm run dev
```

## Produção (Laragon / servidor externo)

Cria o build e arranca o servidor Node.js:

```bash
npm run build
node server.js
```

O servidor fica disponível em `http://localhost:3001`.
Serve os ficheiros estáticos do `dist/` e expõe a API em `/api/pages`.

### Variáveis de ambiente

Copia `.env.example` para `.env` e ajusta os valores:

```
VITE_API_URL=http://localhost:3001/api/pages
PORT=3001
```

> Em modo `npm run dev`, a API é tratada directamente pelo plugin Vite e não é necessário o `server.js`.

export interface DocSection {
  id: string;
  title: string;
  icon?: string;
  children?: DocSection[];
}

export interface ContentBlock {
  id: string;
  type: "heading" | "paragraph" | "code" | "list" | "blockquote" | "divider";
  content: string;
  language?: string;
  filename?: string;
  level?: number; // for headings: 2 or 3
  items?: string[]; // for lists
}

export interface DocPage {
  id: string;
  title: string;
  description: string;
  blocks: ContentBlock[];
}

export const navigation: DocSection[] = [
  {
    id: "getting-started",
    title: "Introdução",
    icon: "🚀",
    children: [
      { id: "installation", title: "Instalação" },
      { id: "quickstart", title: "Início Rápido" },
      { id: "project-structure", title: "Estrutura do Projeto" },
    ],
  },
  {
    id: "fundamentals",
    title: "Fundamentos",
    icon: "📖",
    children: [
      { id: "variables", title: "Variáveis e Tipos" },
      { id: "functions", title: "Funções" },
      { id: "control-flow", title: "Controle de Fluxo" },
      { id: "modules", title: "Módulos" },
    ],
  },
  {
    id: "advanced",
    title: "Avançado",
    icon: "⚡",
    children: [
      { id: "async", title: "Programação Assíncrona" },
      { id: "generics", title: "Generics" },
      { id: "patterns", title: "Design Patterns" },
    ],
  },
  {
    id: "api-reference",
    title: "Referência da API",
    icon: "📋",
    children: [
      { id: "core-api", title: "API Core" },
      { id: "http-client", title: "Cliente HTTP" },
      { id: "database", title: "Base de Dados" },
    ],
  },
  {
    id: "guides",
    title: "Guias",
    icon: "📘",
    children: [
      { id: "deployment", title: "Deploy" },
      { id: "testing", title: "Testes" },
      { id: "performance", title: "Performance" },
    ],
  },
];

export const defaultPages: Record<string, DocPage> = {
  installation: {
    id: "installation",
    title: "Instalação",
    description: "Como instalar e configurar o ambiente de desenvolvimento.",
    blocks: [
      { id: "h-requisitos", type: "heading", level: 2, content: "Requisitos do Sistema" },
      { id: "p-req1", type: "paragraph", content: "Antes de começar, certifique-se de que o seu sistema atende aos seguintes requisitos:" },
      { id: "l-req", type: "list", content: "", items: ["Node.js — versão 18.0 ou superior", "npm ou yarn — gestor de pacotes", "Git — controlo de versão", "Sistema operativo: macOS, Windows 10+ ou Linux"] },
      { id: "h-node", type: "heading", level: 2, content: "Instalação do Node.js" },
      { id: "p-node1", type: "paragraph", content: "Recomendamos usar o nvm (Node Version Manager) para gerir versões do Node.js:" },
      { id: "c-nvm", type: "code", language: "bash", filename: "Terminal", content: "# Instalar nvm\ncurl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash\n\n# Instalar a versão LTS mais recente\nnvm install --lts\n\n# Verificar a instalação\nnode --version\nnpm --version" },
      { id: "h-pkg", type: "heading", level: 2, content: "Gerenciador de Pacotes" },
      { id: "p-pkg1", type: "paragraph", content: "Pode usar npm (incluído com Node.js) ou instalar o yarn:" },
      { id: "c-pkg", type: "code", language: "bash", filename: "Terminal", content: "# Usando npm (já incluído)\nnpm --version\n\n# Ou instalar yarn globalmente\nnpm install -g yarn\nyarn --version" },
      { id: "h-verify", type: "heading", level: 2, content: "Verificação" },
      { id: "p-verify1", type: "paragraph", content: "Após a instalação, verifique que tudo está funcionando:" },
      { id: "c-verify", type: "code", language: "bash", filename: "Terminal", content: "node --version    # v18.0.0 ou superior\nnpm --version     # 9.0.0 ou superior\ngit --version     # 2.0.0 ou superior" },
      { id: "bq-tip", type: "blockquote", content: "Dica: Se encontrar problemas de permissões no macOS/Linux, evite usar sudo. Use o nvm para gerir as instalações do Node.js." },
    ],
  },
  quickstart: {
    id: "quickstart",
    title: "Início Rápido",
    description: "Crie o seu primeiro projeto em minutos.",
    blocks: [
      { id: "h-criar", type: "heading", level: 2, content: "Criar Projeto" },
      { id: "p-criar1", type: "paragraph", content: "Crie um novo projeto usando o CLI:" },
      { id: "c-criar", type: "code", language: "bash", filename: "Terminal", content: "# Criar novo projeto\nnpx create-app my-project\n\n# Entrar no diretório\ncd my-project\n\n# Instalar dependências\nnpm install" },
      { id: "h-struct", type: "heading", level: 2, content: "Estrutura de Ficheiros" },
      { id: "p-struct1", type: "paragraph", content: "O projeto gerado terá a seguinte estrutura:" },
      { id: "c-struct", type: "code", language: "text", filename: "Estrutura", content: "my-project/\n├── src/\n│   ├── components/\n│   ├── pages/\n│   ├── lib/\n│   ├── App.tsx\n│   └── main.tsx\n├── public/\n├── package.json\n├── tsconfig.json\n└── vite.config.ts" },
      { id: "h-exec", type: "heading", level: 2, content: "Executar o Projeto" },
      { id: "c-exec", type: "code", language: "bash", filename: "Terminal", content: "npm run dev\n\n# O servidor inicia em http://localhost:5173" },
      { id: "h-next", type: "heading", level: 2, content: "Próximos Passos" },
      { id: "p-next1", type: "paragraph", content: "Agora que tem o projeto a funcionar, explore a Estrutura do Projeto, Variáveis e Tipos, e comece a criar os seus componentes." },
    ],
  },
  "project-structure": {
    id: "project-structure",
    title: "Estrutura do Projeto",
    description: "Compreenda a organização de ficheiros e pastas.",
    blocks: [
      { id: "h-overview", type: "heading", level: 2, content: "Visão Geral" },
      { id: "p-overview1", type: "paragraph", content: "Um projeto bem organizado segue uma estrutura clara que facilita a manutenção e escalabilidade." },
      { id: "h-dirs", type: "heading", level: 2, content: "Diretórios Principais" },
      { id: "l-dirs", type: "list", content: "", items: ["src/ — Código fonte da aplicação", "src/components/ — Componentes reutilizáveis", "src/pages/ — Páginas/rotas da aplicação", "src/lib/ — Utilitários e helpers", "public/ — Assets estáticos"] },
      { id: "h-config", type: "heading", level: 2, content: "Ficheiros de Configuração" },
      { id: "p-config1", type: "paragraph", content: "Os ficheiros de configuração na raiz do projeto controlam o comportamento do build, TypeScript, linting e outras ferramentas." },
      { id: "c-config", type: "code", language: "text", filename: "Configuração", content: "tsconfig.json     # Configuração TypeScript\nvite.config.ts     # Configuração do Vite\npackage.json       # Dependências e scripts\n.eslintrc          # Regras de linting\ntailwind.config.ts # Configuração Tailwind CSS" },
    ],
  },
  variables: {
    id: "variables",
    title: "Variáveis e Tipos",
    description: "Aprenda sobre declaração de variáveis e o sistema de tipos.",
    blocks: [
      { id: "h-decl", type: "heading", level: 2, content: "Declaração de Variáveis" },
      { id: "p-decl1", type: "paragraph", content: "TypeScript oferece três formas de declarar variáveis:" },
      { id: "c-decl", type: "code", language: "typescript", filename: "variables.ts", content: "// const - valor imutável (recomendado)\nconst name: string = \"DevDocs\";\nconst version: number = 2.0;\n\n// let - valor mutável\nlet counter: number = 0;\ncounter = counter + 1;\n\n// var - evitar (scope global)\nvar legacy = \"não recomendado\";" },
      { id: "h-prim", type: "heading", level: 2, content: "Tipos Primitivos" },
      { id: "c-prim", type: "code", language: "typescript", filename: "types.ts", content: "const greeting: string = \"Olá, mundo!\";\nconst age: number = 25;\nconst price: number = 9.99;\nconst isActive: boolean = true;\nconst empty: null = null;\nconst notDefined: undefined = undefined;" },
      { id: "h-complex", type: "heading", level: 2, content: "Tipos Complexos" },
      { id: "c-complex", type: "code", language: "typescript", filename: "complex-types.ts", content: "// Arrays\nconst numbers: number[] = [1, 2, 3];\nconst names: Array<string> = [\"Ana\", \"João\"];\n\n// Interface\ninterface User {\n  id: number;\n  name: string;\n  email: string;\n  active?: boolean;\n}\n\n// Enum\nenum Status {\n  Active = \"ACTIVE\",\n  Inactive = \"INACTIVE\",\n  Pending = \"PENDING\",\n}" },
      { id: "h-assert", type: "heading", level: 2, content: "Type Assertions" },
      { id: "p-assert1", type: "paragraph", content: "Quando sabe mais sobre o tipo do que o TypeScript:" },
      { id: "c-assert", type: "code", language: "typescript", filename: "assertions.ts", content: "const input = document.getElementById(\"name\") as HTMLInputElement;\ninput.value = \"DevDocs\";" },
    ],
  },
  functions: {
    id: "functions",
    title: "Funções",
    description: "Tudo sobre funções, arrow functions e closures.",
    blocks: [
      { id: "h-fdecl", type: "heading", level: 2, content: "Declaração de Funções" },
      { id: "c-fdecl", type: "code", language: "typescript", filename: "functions.ts", content: "// Função declarativa\nfunction add(a: number, b: number): number {\n  return a + b;\n}\n\n// Expressão de função\nconst multiply = function(a: number, b: number): number {\n  return a * b;\n};" },
      { id: "h-arrow", type: "heading", level: 2, content: "Arrow Functions" },
      { id: "c-arrow", type: "code", language: "typescript", filename: "arrow.ts", content: "const greet = (name: string): string => {\n  return `Olá, ${name}!`;\n};\n\n// Retorno implícito\nconst double = (n: number): number => n * 2;" },
      { id: "h-params", type: "heading", level: 2, content: "Parâmetros e Valores Padrão" },
      { id: "c-params", type: "code", language: "typescript", filename: "params.ts", content: "function log(message: string, level?: string): void {\n  console.log(`[${level ?? \"INFO\"}] ${message}`);\n}\n\nfunction createUser(name: string, role: string = \"user\") {\n  return { name, role };\n}\n\nfunction sum(...numbers: number[]): number {\n  return numbers.reduce((acc, n) => acc + n, 0);\n}" },
      { id: "h-closures", type: "heading", level: 2, content: "Closures" },
      { id: "p-closures1", type: "paragraph", content: "Funções que capturam variáveis do escopo exterior:" },
      { id: "c-closures", type: "code", language: "typescript", filename: "closures.ts", content: "function createCounter(initial: number = 0) {\n  let count = initial;\n  return {\n    increment: () => ++count,\n    decrement: () => --count,\n    getCount: () => count,\n  };\n}\n\nconst counter = createCounter(10);\ncounter.increment(); // 11\ncounter.increment(); // 12" },
    ],
  },
  "control-flow": {
    id: "control-flow",
    title: "Controle de Fluxo",
    description: "Condicionais, loops e tratamento de erros.",
    blocks: [
      { id: "h-cond", type: "heading", level: 2, content: "Condicionais" },
      { id: "c-cond", type: "code", language: "typescript", filename: "conditionals.ts", content: "// if/else\nif (age >= 18) {\n  console.log(\"Maior de idade\");\n} else {\n  console.log(\"Menor de idade\");\n}\n\n// Ternário\nconst status = isActive ? \"Ativo\" : \"Inativo\";\n\n// Switch\nswitch (role) {\n  case \"admin\":\n    return \"Administrador\";\n  case \"user\":\n    return \"Utilizador\";\n  default:\n    return \"Desconhecido\";\n}" },
      { id: "h-loops", type: "heading", level: 2, content: "Loops" },
      { id: "c-loops", type: "code", language: "typescript", filename: "loops.ts", content: "// for...of (recomendado)\nfor (const item of items) {\n  console.log(item);\n}\n\n// forEach\nitems.forEach((item, index) => {\n  console.log(`${index}: ${item}`);\n});\n\n// while\nlet i = 0;\nwhile (i < 10) {\n  i++;\n}" },
      { id: "h-errors", type: "heading", level: 2, content: "Tratamento de Erros" },
      { id: "c-errors", type: "code", language: "typescript", filename: "errors.ts", content: "try {\n  const data = JSON.parse(rawData);\n  processData(data);\n} catch (error) {\n  if (error instanceof SyntaxError) {\n    console.error(\"JSON inválido:\", error.message);\n  } else {\n    throw error;\n  }\n} finally {\n  cleanup();\n}" },
    ],
  },
  modules: {
    id: "modules",
    title: "Módulos",
    description: "Sistema de módulos, imports e exports.",
    blocks: [
      { id: "h-export", type: "heading", level: 2, content: "Exportações" },
      { id: "c-export", type: "code", language: "typescript", filename: "math.ts", content: "// Named exports\nexport const PI = 3.14159;\nexport function add(a: number, b: number) { return a + b; }\n\n// Default export\nexport default class Calculator {\n  add(a: number, b: number) { return a + b; }\n}" },
      { id: "h-import", type: "heading", level: 2, content: "Importações" },
      { id: "c-import", type: "code", language: "typescript", filename: "app.ts", content: "// Named imports\nimport { PI, add } from './math';\n\n// Default import\nimport Calculator from './math';\n\n// Rename\nimport { add as sum } from './math';\n\n// Import tudo\nimport * as Math from './math';" },
      { id: "h-ns", type: "heading", level: 2, content: "Namespaces" },
      { id: "p-ns1", type: "paragraph", content: "Namespaces agrupam código relacionado sob um identificador comum, embora módulos ES sejam geralmente preferidos." },
      { id: "c-ns", type: "code", language: "typescript", filename: "namespace.ts", content: "namespace Validation {\n  export interface StringValidator {\n    isValid(s: string): boolean;\n  }\n\n  export class EmailValidator implements StringValidator {\n    isValid(s: string) {\n      return s.includes('@');\n    }\n  }\n}" },
    ],
  },
  async: {
    id: "async",
    title: "Programação Assíncrona",
    description: "Promises, async/await e padrões de concorrência.",
    blocks: [
      { id: "h-promises", type: "heading", level: 2, content: "Promises" },
      { id: "c-promises", type: "code", language: "typescript", filename: "promises.ts", content: "function fetchData(url: string): Promise<Response> {\n  return new Promise((resolve, reject) => {\n    fetch(url)\n      .then(response => resolve(response))\n      .catch(error => reject(error));\n  });\n}\n\nfetchData(\"/api/users\")\n  .then(res => res.json())\n  .then(data => console.log(data))\n  .catch(err => console.error(err));" },
      { id: "h-aa", type: "heading", level: 2, content: "Async/Await" },
      { id: "c-aa", type: "code", language: "typescript", filename: "async-await.ts", content: "async function getUser(id: number): Promise<User> {\n  try {\n    const response = await fetch(`/api/users/${id}`);\n    if (!response.ok) {\n      throw new Error(`HTTP error! status: ${response.status}`);\n    }\n    return await response.json();\n  } catch (error) {\n    console.error(\"Erro ao buscar utilizador:\", error);\n    throw error;\n  }\n}" },
      { id: "h-conc", type: "heading", level: 2, content: "Padrões de Concorrência" },
      { id: "c-conc", type: "code", language: "typescript", filename: "concurrency.ts", content: "// Promise.all - todas devem resolver\nconst [users, posts] = await Promise.all([\n  fetch(\"/api/users\").then(r => r.json()),\n  fetch(\"/api/posts\").then(r => r.json()),\n]);\n\n// Promise.race - retorna a primeira\nconst fastest = await Promise.race([\n  fetch(\"/api/server-a\"),\n  fetch(\"/api/server-b\"),\n]);" },
    ],
  },
  generics: {
    id: "generics",
    title: "Generics",
    description: "Tipos genéricos e programação genérica.",
    blocks: [
      { id: "h-basic", type: "heading", level: 2, content: "Conceitos Básicos" },
      { id: "c-basic", type: "code", language: "typescript", filename: "generics.ts", content: "function identity<T>(value: T): T {\n  return value;\n}\n\nconst str = identity<string>(\"hello\");\nconst num = identity(42); // inferido\n\ninterface ApiResponse<T> {\n  data: T;\n  status: number;\n  message: string;\n}" },
      { id: "h-const", type: "heading", level: 2, content: "Constraints" },
      { id: "c-const", type: "code", language: "typescript", filename: "constraints.ts", content: "function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {\n  return obj[key];\n}\n\ninterface HasLength {\n  length: number;\n}\n\nfunction logLength<T extends HasLength>(value: T): void {\n  console.log(`Comprimento: ${value.length}`);\n}" },
      { id: "h-util", type: "heading", level: 2, content: "Utility Types" },
      { id: "c-util", type: "code", language: "typescript", filename: "utility.ts", content: "interface User {\n  id: number;\n  name: string;\n  email: string;\n}\n\ntype UpdateUser = Partial<User>;\ntype UserPreview = Pick<User, \"id\" | \"name\">;\ntype CreateUser = Omit<User, \"id\">;\ntype UserMap = Record<string, User>;" },
    ],
  },
  patterns: {
    id: "patterns",
    title: "Design Patterns",
    description: "Padrões de design comuns em TypeScript.",
    blocks: [
      { id: "h-singleton", type: "heading", level: 2, content: "Singleton" },
      { id: "p-singleton", type: "paragraph", content: "Garante que uma classe tenha apenas uma instância:" },
      { id: "c-singleton", type: "code", language: "typescript", filename: "singleton.ts", content: "class Database {\n  private static instance: Database;\n  private constructor() {}\n\n  static getInstance(): Database {\n    if (!Database.instance) {\n      Database.instance = new Database();\n    }\n    return Database.instance;\n  }\n}" },
      { id: "h-observer", type: "heading", level: 2, content: "Observer" },
      { id: "c-observer", type: "code", language: "typescript", filename: "observer.ts", content: "interface Observer {\n  update(data: any): void;\n}\n\nclass EventEmitter {\n  private observers: Observer[] = [];\n\n  subscribe(observer: Observer) {\n    this.observers.push(observer);\n  }\n\n  notify(data: any) {\n    this.observers.forEach(o => o.update(data));\n  }\n}" },
      { id: "h-factory", type: "heading", level: 2, content: "Factory" },
      { id: "c-factory", type: "code", language: "typescript", filename: "factory.ts", content: "interface Shape {\n  area(): number;\n}\n\nclass ShapeFactory {\n  static create(type: \"circle\" | \"square\", size: number): Shape {\n    switch (type) {\n      case \"circle\":\n        return { area: () => Math.PI * size ** 2 };\n      case \"square\":\n        return { area: () => size ** 2 };\n    }\n  }\n}" },
    ],
  },
  "core-api": {
    id: "core-api",
    title: "API Core",
    description: "Referência completa da API principal.",
    blocks: [
      { id: "h-config-api", type: "heading", level: 2, content: "Configuração" },
      { id: "c-config-api", type: "code", language: "typescript", filename: "config.ts", content: "import { createApp } from './core';\n\nconst app = createApp({\n  port: 3000,\n  debug: true,\n  cors: { origin: '*' },\n});" },
      { id: "h-methods", type: "heading", level: 2, content: "Métodos" },
      { id: "c-methods", type: "code", language: "typescript", filename: "methods.ts", content: "app.get('/users', async (ctx) => {\n  return ctx.json(await getUsers());\n});\n\napp.post('/users', async (ctx) => {\n  const body = await ctx.body();\n  return ctx.json(await createUser(body), 201);\n});" },
      { id: "h-events", type: "heading", level: 2, content: "Eventos" },
      { id: "c-events", type: "code", language: "typescript", filename: "events.ts", content: "app.on('start', () => console.log('Servidor iniciado'));\napp.on('error', (err) => console.error(err));\napp.on('request', (req) => console.log(req.method, req.url));" },
    ],
  },
  "http-client": {
    id: "http-client",
    title: "Cliente HTTP",
    description: "Como fazer requisições HTTP.",
    blocks: [
      { id: "h-get", type: "heading", level: 2, content: "GET Requests" },
      { id: "c-get", type: "code", language: "typescript", filename: "get.ts", content: "const response = await fetch('/api/users');\nconst users = await response.json();\n\n// Com query params\nconst params = new URLSearchParams({ page: '1', limit: '10' });\nconst res = await fetch(`/api/users?${params}`);" },
      { id: "h-post", type: "heading", level: 2, content: "POST Requests" },
      { id: "c-post", type: "code", language: "typescript", filename: "post.ts", content: "const response = await fetch('/api/users', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ name: 'João', email: 'joao@dev.com' }),\n});" },
      { id: "h-intercept", type: "heading", level: 2, content: "Interceptors" },
      { id: "p-intercept", type: "paragraph", content: "Interceptores permitem modificar requests e responses globalmente, ideal para autenticação e logging." },
      { id: "c-intercept", type: "code", language: "typescript", filename: "interceptor.ts", content: "const originalFetch = window.fetch;\nwindow.fetch = async (url, options = {}) => {\n  const token = localStorage.getItem('token');\n  options.headers = {\n    ...options.headers,\n    Authorization: `Bearer ${token}`,\n  };\n  return originalFetch(url, options);\n};" },
    ],
  },
  database: {
    id: "database",
    title: "Base de Dados",
    description: "Integração com bases de dados.",
    blocks: [
      { id: "h-conn", type: "heading", level: 2, content: "Conexão" },
      { id: "c-conn", type: "code", language: "typescript", filename: "database.ts", content: "import { createClient } from './db';\n\nconst db = createClient({\n  host: 'localhost',\n  port: 5432,\n  database: 'myapp',\n});\n\nawait db.connect();" },
      { id: "h-queries", type: "heading", level: 2, content: "Queries" },
      { id: "c-queries", type: "code", language: "typescript", filename: "queries.ts", content: "// Select\nconst users = await db.query('SELECT * FROM users WHERE active = $1', [true]);\n\n// Insert\nawait db.query(\n  'INSERT INTO users (name, email) VALUES ($1, $2)',\n  ['Maria', 'maria@dev.com']\n);" },
      { id: "h-migrations", type: "heading", level: 2, content: "Migrations" },
      { id: "c-migrations", type: "code", language: "bash", filename: "Terminal", content: "# Criar migration\nnpx migrate create add-users-table\n\n# Executar migrations\nnpx migrate up\n\n# Reverter última migration\nnpx migrate down" },
    ],
  },
  deployment: {
    id: "deployment",
    title: "Deploy",
    description: "Como fazer deploy da sua aplicação.",
    blocks: [
      { id: "h-build", type: "heading", level: 2, content: "Build de Produção" },
      { id: "c-build", type: "code", language: "bash", filename: "Terminal", content: "# Build otimizado\nnpm run build\n\n# Preview local do build\nnpm run preview" },
      { id: "h-platforms", type: "heading", level: 2, content: "Plataformas" },
      { id: "l-platforms", type: "list", content: "", items: ["Vercel — Deploy automático com git push", "Netlify — Deploy contínuo com CDN global", "AWS — S3 + CloudFront para SPAs", "Docker — Containerização para qualquer cloud"] },
      { id: "h-cicd", type: "heading", level: 2, content: "CI/CD" },
      { id: "c-cicd", type: "code", language: "yaml", filename: ".github/workflows/deploy.yml", content: "name: Deploy\non:\n  push:\n    branches: [main]\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n      - run: npm ci\n      - run: npm run build\n      - run: npm run deploy" },
    ],
  },
  testing: {
    id: "testing",
    title: "Testes",
    description: "Escrever e executar testes.",
    blocks: [
      { id: "h-unit", type: "heading", level: 2, content: "Testes Unitários" },
      { id: "c-unit", type: "code", language: "typescript", filename: "math.test.ts", content: "import { describe, it, expect } from 'vitest';\nimport { add } from './math';\n\ndescribe('add', () => {\n  it('soma dois números', () => {\n    expect(add(2, 3)).toBe(5);\n  });\n\n  it('soma números negativos', () => {\n    expect(add(-1, -2)).toBe(-3);\n  });\n});" },
      { id: "h-integ", type: "heading", level: 2, content: "Testes de Integração" },
      { id: "c-integ", type: "code", language: "typescript", filename: "api.test.ts", content: "import { describe, it, expect } from 'vitest';\n\ndescribe('API /users', () => {\n  it('retorna lista de utilizadores', async () => {\n    const res = await fetch('/api/users');\n    expect(res.status).toBe(200);\n    const data = await res.json();\n    expect(Array.isArray(data)).toBe(true);\n  });\n});" },
      { id: "h-e2e", type: "heading", level: 2, content: "Testes E2E" },
      { id: "c-e2e", type: "code", language: "typescript", filename: "login.spec.ts", content: "import { test, expect } from '@playwright/test';\n\ntest('login flow', async ({ page }) => {\n  await page.goto('/login');\n  await page.fill('[name=email]', 'user@test.com');\n  await page.fill('[name=password]', 'password');\n  await page.click('button[type=submit]');\n  await expect(page).toHaveURL('/dashboard');\n});" },
    ],
  },
  performance: {
    id: "performance",
    title: "Performance",
    description: "Otimização e melhores práticas de performance.",
    blocks: [
      { id: "h-profiling", type: "heading", level: 2, content: "Profiling" },
      { id: "p-profiling", type: "paragraph", content: "Use ferramentas do browser para identificar bottlenecks de performance na sua aplicação." },
      { id: "c-profiling", type: "code", language: "typescript", filename: "profiling.ts", content: "// Medir tempo de execução\nconsole.time('operação');\nawait heavyOperation();\nconsole.timeEnd('operação');\n\n// Performance API\nperformance.mark('start');\nawait process();\nperformance.mark('end');\nperformance.measure('process', 'start', 'end');" },
      { id: "h-optim", type: "heading", level: 2, content: "Otimizações" },
      { id: "l-optim", type: "list", content: "", items: ["Lazy loading de componentes e rotas", "Memoização com useMemo e useCallback", "Virtualização de listas longas", "Code splitting automático"] },
      { id: "h-cache", type: "heading", level: 2, content: "Caching" },
      { id: "c-cache", type: "code", language: "typescript", filename: "cache.ts", content: "class SimpleCache<T> {\n  private cache = new Map<string, { data: T; expires: number }>();\n\n  set(key: string, data: T, ttl: number = 60000) {\n    this.cache.set(key, { data, expires: Date.now() + ttl });\n  }\n\n  get(key: string): T | null {\n    const entry = this.cache.get(key);\n    if (!entry || Date.now() > entry.expires) return null;\n    return entry.data;\n  }\n}" },
    ],
  },
};

// Get all page IDs in order
export const allPageIds = navigation.flatMap(
  (section) => section.children?.map((c) => c.id) ?? []
);

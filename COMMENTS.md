# Execução das aplicações com Docker

Este monorepo contém duas aplicações:

- `grupo-a-api`: backend Fastify + Prisma em Node.js com PostgreSQL.
- `grupo-a-admin`: frontend Vue 3 com Vite, Vuetify 3, Pinia, Vue Router, Axios e TypeScript.

As instruções abaixo assumem que Docker e Docker Compose v2 (ou superior) estão instalados.

## Backend (`grupo-a-api`)

1. **Configurar variáveis de ambiente**
   - Caso exista um arquivo de exemplo (`.env.example`), copie-o: `cp grupo-a-api/.env.example grupo-a-api/.env`.
   - Ajuste `DATABASE_URL`, credenciais JWT e demais variáveis conforme seu ambiente.

2. **Subir a API e o banco via Docker Compose**
   ```sh
   docker compose -f grupo-a-api/docker-compose.yml up --build
   ```
   O compose inicia PostgreSQL, aplica migrações Prisma e publica a API em `http://localhost:3001` quando os logs indicarem `Server listening`.

3. **Aplicar migrações manualmente (opcional)**
   ```sh
   docker compose -f grupo-a-api/docker-compose.yml run --rm api npx prisma migrate deploy
   ```

## Frontend (`grupo-a-admin`)

1. Garanta que `grupo-a-admin/.env` tenha `VITE_API_BASE_URL=http://localhost:3000` (ou outro endpoint da API).
2. Dentro de `grupo-a-admin`, execute:
   ```sh
   npm install
   npm run dev 
   ```
3. A interface estará em `http://localhost:5173`.

## Tecnologias principais do frontend

- **Vue 3 + Vite**: SPA modular com carregamento rápido.
- **Vuetify 3**: biblioteca de componentes Material Design com theming.
- **Pinia**: gerenciamento de estado global reativo.
- **Vue Router**: navegação declarativa entre telas administrativas.
- **Axios**: cliente HTTP configurado com bearer token.
- **TypeScript + ESLint + Prettier**: tipagem estática e higiene de código.

## Melhorias sugeridas

- **Fluxo de autenticação completo**: implementar cadastro / recuperação de senha no login e fluxos de onboarding.
- **Módulo de cursos**: finalizar o CRUD já iniciado no backend, expondo matrículas, filtros e dashboards no front.
- **Gestão de turmas e professores**: estender o domínio para relacionamentos turma ↔ curso ↔ professor, com telas de alocação.
- **Seed de dados mais robusto**: evoluir `npm run seed` para gerar cenários realistas (cursos, professores, turmas, matrículas) e opcionalmente usar fixtures por ambiente.
- **Observabilidade**: incluir logs estruturados (Pino), métricas e monitoramento de erros (Sentry ou similar).
- **CI/CD & Deploy**: publicar imagens em registry (GitHub Container Registry, Docker Hub), automatizar deploy em serviços como Render, Railway, Fly.io ou AWS ECS/Fargate.

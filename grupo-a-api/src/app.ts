import Fastify from 'fastify';
import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import security from './plugins/security';
import prismaPlugin from './plugins/prisma';
import { env } from './config/env';

declare module 'fastify' {
  interface FastifyInstance { config: typeof env; }
}

export async function buildApp() {
  const app = Fastify({ logger: true });
  app.decorate('config', env);

  await app.register(fp(async (app) => app.register(jwt, { secret: env.JWT_SECRET })));
  await app.register(security);
  await app.register(prismaPlugin);

  app.get('/health', async () => ({ ok: true, env: env.NODE_ENV }));

  // rotas
  await app.register((await import('./modules/auth/auth.routes')).default);
  await app.register((await import('./modules/admin/admin.routes')).default);
  await app.register((await import('./modules/alunos/alunos.routes')).default);

  return app;
}

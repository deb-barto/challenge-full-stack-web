import fp from 'fastify-plugin';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import rate from '@fastify/rate-limit';
import { env } from '../config/env';

export default fp(async (app) => {
  await app.register(helmet);
  await app.register(cors, { origin: env.CORS_ORIGIN });
  await app.register(rate, { max: env.RATE_MAX, timeWindow: '1 minute' });
});
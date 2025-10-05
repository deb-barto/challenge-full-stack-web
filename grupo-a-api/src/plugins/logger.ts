import fp from 'fastify-plugin';
import pino from 'pino';

export default fp(async (app) => {
  const logger = pino();
  app.addHook('onRequest', async (req) => {
    req.id = req.id || crypto.randomUUID();
  });
  app.log = logger;
});
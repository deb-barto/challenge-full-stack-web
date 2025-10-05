import { FastifyInstance } from 'fastify';
import { loginSchema } from './auth.schemas';
import { doLogin } from './auth.service';

export default async function routes(app: FastifyInstance){
  app.post('/auth/login', {
    schema: {
      tags: ['auth'],
      summary: 'login admin',
      body: {
        type: 'object',
        required: ['username','password'],
        properties: {
          username: { type: 'string', minLength: 3 },
          password: { type: 'string', minLength: 6 },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            access: { type: 'string' },
            refresh: { type: 'string' },
            admin: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                username: { type: 'string' },
                email: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' },
              },
            },
          },
        },
        401: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
  }, async (req, rep) => {
    const { username, password } = loginSchema.parse(req.body);
    const session = await doLogin(app, username, password);
    if (!session) return rep.code(401).send({ error: 'invalid credentials' });
    return session;
  });

  app.post('/auth/refresh', async (req, rep) => {
    try {
      const payload = await req.jwtVerify<{ sub: string; typ?: string }>();
      if (payload.typ !== 'refresh') throw new Error();
      const access = app.jwt.sign({ sub: payload.sub, role: 'ADMIN' }, { expiresIn: app.config.JWT_EXPIRES });
      return { access };
    } catch { return rep.code(401).send({ error: 'invalid refresh token' }); }
  });
}

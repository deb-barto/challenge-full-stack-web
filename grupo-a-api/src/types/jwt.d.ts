import '@fastify/jwt';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { sub: string; role: 'ADMIN'; username?: string; typ?: string }
    user: { sub: string; role: 'ADMIN'; username?: string; typ?: string }
  }
}
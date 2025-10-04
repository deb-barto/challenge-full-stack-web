import '@fastify/jwt';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { sub: string; role: 'ADMIN'; typ?: string }
    user: { sub: string; role: 'ADMIN'; typ?: string }
  }
}
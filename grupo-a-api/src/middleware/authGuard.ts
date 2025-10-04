
import { FastifyReply, FastifyRequest } from 'fastify';

export async function authGuard(req: FastifyRequest, rep: FastifyReply) {
  try {
    const auth = await req.jwtVerify<{ sub: string; role: 'ADMIN' }>();
    if (auth.role !== 'ADMIN') throw new Error('forbidden');
    (req as any).user = auth;
  } catch {
    return rep.code(401).send({ error: 'unauthorized' });
  }
}
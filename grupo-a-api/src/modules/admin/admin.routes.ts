import { FastifyInstance } from 'fastify';
import { authGuard } from '../../middleware/authGuard';

export default async function routes(app: FastifyInstance){
  app.get('/admins/me', { preHandler: authGuard }, async (req) => {
    const user = (req as any).user;
    const me = await app.prisma.admin.findUnique({ where: { id: user.sub }, select: { id:true, username:true, email:true, createdAt:true }});
    return me;
  });
}
import { FastifyInstance } from 'fastify';
import { authGuard } from '../../middleware/authGuard';
import studentsRoutes from '../students/students.routes';
import coursesRoutes from '../courses/courses.routes';

export default async function routes(app: FastifyInstance){
  app.get('/admins/me', { preHandler: authGuard }, async (req) => {
    const user = (req as any).user;
    const me = await app.prisma.admin.findUnique({ where: { id: user.sub } });
    return me;
  });

  await app.register(studentsRoutes, { prefix: '/admin' });
  await app.register(coursesRoutes, { prefix: '/admin' });
}
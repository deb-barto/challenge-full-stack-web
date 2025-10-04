import { FastifyInstance } from 'fastify';
import { authGuard } from '../../middleware/authGuard';
import { alunoCreate } from './alunos.schemas';

export default async function routes(app: FastifyInstance){
  app.get('/alunos', { preHandler: authGuard }, async () => {
    return app.prisma.aluno.findMany({ orderBy: { createdAt: 'desc' } });
  });

  app.post('/alunos', { preHandler: authGuard }, async (req, rep) => {
    const dto = alunoCreate.parse(req.body);
    const r = await app.prisma.aluno.create({ data: dto });
    return rep.code(201).send(r);
  });
}
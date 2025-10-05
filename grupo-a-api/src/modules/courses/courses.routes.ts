import { FastifyInstance } from 'fastify';
import { authGuard } from '../../middleware/authGuard';
import { courseCreate, courseQuery, courseUpdate } from './courses.schemas';
import { HttpError } from '../../utils/httpErrors';

export default async function routes(app: FastifyInstance){
  app.get('/courses', { preHandler: authGuard }, async (req) => {
    const { page, limit, status, search } = courseQuery.parse(req.query);
    const where = {
      ...(status ? { status } : {}),
      ...(search ? { name: { contains: search, mode: 'insensitive' as const } } : {}),
    };

    const [total, data] = await app.prisma.$transaction([
      app.prisma.course.count({ where }),
      app.prisma.course.findMany({
        where,
        orderBy: { name: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          enrollments: {
            include: { student: true },
          },
        },
      }),
    ]);

    return {
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      data,
    };
  });

  app.post('/courses', { preHandler: authGuard }, async (req, rep) => {
    const dto = courseCreate.parse(req.body);
    const { studentIds, ...data } = dto;

    const course = await app.prisma.course.create({
      data: {
        ...data,
        enrollments: studentIds?.length
          ? { createMany: { data: studentIds.map((studentId) => ({ studentId })) } }
          : undefined,
      },
      include: { enrollments: { include: { student: true } } },
    });

    return rep.code(201).send(course);
  });

  app.patch('/courses/:id', { preHandler: authGuard }, async (req) => {
    const { id } = req.params as { id: string };
    const dto = courseUpdate.parse(req.body);
    const existing = await app.prisma.course.findUnique({ where: { id } });
    if (!existing) throw new HttpError(404, 'course not found');

    const { studentIds, ...data } = dto;

    return app.prisma.$transaction(async (tx) => {
      await tx.course.update({ where: { id }, data });
      if (studentIds) {
        await tx.enrollment.deleteMany({ where: { courseId: id } });
        if (studentIds.length){
          await tx.enrollment.createMany({ data: studentIds.map((studentId) => ({ studentId, courseId: id })) });
        }
      }
      return tx.course.findUnique({
        where: { id },
        include: { enrollments: { include: { student: true } } },
      });
    });
  });

  app.delete('/courses/:id', { preHandler: authGuard }, async (req, rep) => {
    const { id } = req.params as { id: string };
    await app.prisma.course.delete({ where: { id } });
    return rep.code(204).send();
  });
}


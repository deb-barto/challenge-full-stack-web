import { FastifyInstance } from 'fastify';
import { Prisma } from '@prisma/client';
import { authGuard } from '../../middleware/authGuard';
import { studentCreate, studentQuery, studentUpdate, studentUniqueEmailQuery, studentUniqueNameQuery } from './students.schemas';
import { HttpError } from '../../utils/httpErrors';

export default async function routes(app: FastifyInstance){
  async function generateAcademicRecord(){
    const year = new Date().getFullYear();
    let attempts = 0;
    while (attempts < 10){
      const random = Math.random().toString(36).toUpperCase().slice(-6);
      const candidate = `RA-${year}-${random}`;
      const exists = await app.prisma.student.findUnique({ where: { academicRecord: candidate } });
      if (!exists) return candidate;
      attempts += 1;
    }
    throw new HttpError(500, 'unable to generate academic record');
  }

  app.get('/students', { preHandler: authGuard }, async (req) => {
    const { page, limit, search } = studentQuery.parse(req.query);
    const where = search ? {
      name: { contains: search, mode: 'insensitive' as const },
    } : undefined;

    const [total, data] = await app.prisma.$transaction([
      app.prisma.student.count({ where }),
      app.prisma.student.findMany({
        where,
        orderBy: { name: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          enrollments: {
            include: { course: true },
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

  app.get('/students/:id', { preHandler: authGuard }, async (req) => {
    const { id } = req.params as { id: string };
    const student = await app.prisma.student.findUnique({
      where: { id },
      include: {
        enrollments: {
          include: { course: true },
        },
      },
    });
    if (!student) throw new HttpError(404, 'student not found');
    return student;
  });

  app.post('/students', { preHandler: authGuard }, async (req, rep) => {
    const dto = studentCreate.parse(req.body);
    const { courseIds, classGroup, ...data } = dto;
    const academicRecord = await generateAcademicRecord();

    try {
      const student = await app.prisma.student.create({
        data: {
          ...data,
          academicRecord,
          classGroup,
          enrollments: courseIds?.length
            ? { createMany: { data: courseIds.map((courseId) => ({ courseId })) } }
            : undefined,
        },
        include: { enrollments: { include: { course: true } } },
      });
      return rep.code(201).send(student);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const target = (error.meta?.target as string[] | undefined) ?? [];
        let message = 'registro já cadastrado';
        if (target.includes('email')) message = 'E-mail já cadastrado';
        else if (target.includes('cpf')) message = 'CPF já cadastrado';
        else if (target.includes('name')) message = 'Nome já cadastrado';
        throw new HttpError(409, message);
      }
      throw error;
    }
  });

  app.patch('/students/:id', { preHandler: authGuard }, async (req) => {
    const { id } = req.params as { id: string };
    const dto = studentUpdate.parse(req.body);
    const existing = await app.prisma.student.findUnique({ where: { id } });
    if (!existing) throw new HttpError(404, 'student not found');

    const { courseIds, classGroup, ...data } = dto;

    try {
      return await app.prisma.$transaction(async (tx) => {
        await tx.student.update({ where: { id }, data: { ...data, classGroup } });
        if (courseIds) {
          await tx.enrollment.deleteMany({ where: { studentId: id } });
          if (courseIds.length){
            await tx.enrollment.createMany({ data: courseIds.map((courseId) => ({ studentId: id, courseId })) });
          }
        }
        return tx.student.findUnique({
          where: { id },
          include: { enrollments: { include: { course: true } } },
        });
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const target = (error.meta?.target as string[] | undefined) ?? [];
        let message = 'registro já cadastrado';
        if (target.includes('email')) message = 'E-mail já cadastrado';
        else if (target.includes('cpf')) message = 'CPF já cadastrado';
        else if (target.includes('name')) message = 'Nome já cadastrado';
        throw new HttpError(409, message);
      }
      throw error;
    }
  });

  app.delete('/students/:id', { preHandler: authGuard }, async (req, rep) => {
    const { id } = req.params as { id: string };
    await app.prisma.student.delete({ where: { id } });
    return rep.code(204).send();
  });

  app.get('/students/check-name', { preHandler: authGuard }, async (req) => {
    const { name, ignoreId } = studentUniqueNameQuery.parse(req.query);
    const exists = await app.prisma.student.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
        NOT: ignoreId ? { id: ignoreId } : undefined,
      },
      select: { id: true },
    });
    return { exists: !!exists };
  });

  app.get('/students/check-email', { preHandler: authGuard }, async (req) => {
    const { email, ignoreId } = studentUniqueEmailQuery.parse(req.query);
    const exists = await app.prisma.student.findFirst({
      where: {
        email: { equals: email, mode: 'insensitive' },
        NOT: ignoreId ? { id: ignoreId } : undefined,
      },
      select: { id: true },
    });
    return { exists: !!exists };
  });
}


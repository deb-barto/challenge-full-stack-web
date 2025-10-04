import { z } from 'zod';
export const alunoCreate = z.object({ nome: z.string().min(2), email: z.string().email().optional(), turma: z.string().optional() });
export type AlunoCreate = z.infer<typeof alunoCreate>;
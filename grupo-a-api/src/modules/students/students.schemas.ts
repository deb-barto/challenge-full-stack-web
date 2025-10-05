import { z } from 'zod';

const cpfRegex = /^\d{11}$/;

export const studentQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().min(1).max(120).optional(),
});

export const studentCreate = z.object({
  name: z.string().min(2).max(120),
  cpf: z.string().regex(cpfRegex, 'cpf must have 11 digits'),
  email: z.string().email().optional(),
  classGroup: z.string().min(1).max(30).optional(),
  courseIds: z.array(z.string().cuid()).optional(),
});

export const studentUpdate = studentCreate.partial().extend({
  courseIds: z.array(z.string().cuid()).optional(),
});

export const studentUniqueNameQuery = z.object({
  name: z.string().trim().min(2).max(120),
  ignoreId: z.string().cuid().optional(),
});

export const studentUniqueEmailQuery = z.object({
  email: z.string().trim().email().max(140),
  ignoreId: z.string().cuid().optional(),
});

export type StudentQuery = z.infer<typeof studentQuery>;
export type StudentCreate = z.infer<typeof studentCreate>;
export type StudentUpdate = z.infer<typeof studentUpdate>;
export type StudentUniqueNameQuery = z.infer<typeof studentUniqueNameQuery>;
export type StudentUniqueEmailQuery = z.infer<typeof studentUniqueEmailQuery>;


import { z } from 'zod';

export const courseQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: z.enum(['SCHEDULED','ONGOING','FINISHED']).optional(),
  search: z.string().trim().min(1).max(120).optional(),
});

const weekDaysValues = ['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'] as const;
const shiftValues = ['MORNING','AFTERNOON','EVENING'] as const;

export const courseCreate = z.object({
  name: z.string().min(3).max(120),
  status: z.enum(['SCHEDULED','ONGOING','FINISHED']),
  studentLimit: z.number().int().positive(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  instructor: z.string().min(3).max(120),
  shift: z.enum(shiftValues),
  weekDays: z.array(z.enum(weekDaysValues)).min(1),
  timeSlot: z.string().min(3).max(50),
  studentIds: z.array(z.string().cuid()).optional(),
});

export const courseUpdate = courseCreate.partial().extend({
  studentIds: z.array(z.string().cuid()).optional(),
});

export type CourseQuery = z.infer<typeof courseQuery>;
export type CourseCreate = z.infer<typeof courseCreate>;
export type CourseUpdate = z.infer<typeof courseUpdate>;


import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development','test','production']).default('development'),
  PORT: z.coerce.number().default(3001),
  DATABASE_URL: z.string().min(10),
  JWT_SECRET: z.string().min(16),
  JWT_EXPIRES: z.string().default('15m'),
  JWT_REFRESH_EXPIRES: z.string().default('7d'),
  CORS_ORIGIN: z.string().default('*'),
  RATE_MAX: z.coerce.number().default(300)
});

export const env = schema.parse(process.env);
export const isDev = env.NODE_ENV !== 'production';
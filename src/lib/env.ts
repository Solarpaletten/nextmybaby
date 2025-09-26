import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  NEXT_PUBLIC_APP_NAME: z.string().default('DashkaNext'),
});

const parsed = EnvSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
});

if (!parsed.success) {
  console.warn('ENV validation warnings:', parsed.error.flatten().fieldErrors);
}

export const ENV = parsed.success
  ? parsed.data
  : {
      NODE_ENV: process.env.NODE_ENV ?? 'development',
      NEXT_PUBLIC_APP_NAME: 'DashkaNext',
    };

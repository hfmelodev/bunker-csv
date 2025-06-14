import 'dotenv/config'

import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  API_PROTHEUS_DATA: z.string().url(),
  API_PROTHEUS_ST: z.string().url(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('> Invalid environment variables.', _env.error.format())

  throw new Error('> Invalid environment variables.')
}

export const env = _env.data

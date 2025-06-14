import type { FastifyInstance } from 'fastify'
import { createLawyersController } from '../controllers/create-lawyers'

export async function appRouter(app: FastifyInstance) {
  app.post('/create-lawyers', createLawyersController)
}

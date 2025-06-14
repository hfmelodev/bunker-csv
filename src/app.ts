import fastifyCors from '@fastify/cors'
import fastifyMultipart from '@fastify/multipart'
import fastify from 'fastify'
import { ZodError } from 'zod'
import { appRouter } from './http/routes'

export const app = fastify({
  connectionTimeout: 5000000, // 5 minutes
})

app.register(fastifyCors)
app.register(fastifyMultipart)

app.register(appRouter)

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: '> There was an error validating the data.',
      issues: error.format(),
    })
  }

  return reply.status(500).send({ message: '> Internal server error.' })
})

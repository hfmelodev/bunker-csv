import fastifyCors from '@fastify/cors'
import fastify from 'fastify'
import { ZodError } from 'zod'

export const app = fastify()

app.register(fastifyCors)

app.get('/', async () => {
  return { hello: 'world' }
})

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: '> There was an error validating the data.',
      issues: error.format(),
    })
  }

  return reply.status(500).send({ message: '> Internal server error.' })
})

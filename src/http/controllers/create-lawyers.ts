import { AxiosError } from 'axios'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { PrismaLawyersRepository } from '../../repositories/prisma/lawyers-repository'
import { CreateLawyersService } from '../services/create-lawyers'

export async function createLawyersController(request: FastifyRequest, reply: FastifyReply) {
  const file = await request.file()

  try {
    const prismaLawyersRepository = new PrismaLawyersRepository()

    const registerLawyersUseCase = new CreateLawyersService(prismaLawyersRepository)

    const {
      totalRegisters,
      totalRegisteredLawyersInGoodStanding,
      totalUnregisteredLawyersInBadStanding,
      totalInvalidCpfLawyers,
    } = await registerLawyersUseCase.execute({
      file,
    })

    return reply.status(201).send({
      totalRegisters,
      totalRegisteredLawyersInGoodStanding,
      totalUnregisteredLawyersInBadStanding,
      totalInvalidCpfLawyers,
    })
  } catch (err) {
    if (err instanceof AxiosError) {
      console.log(err)

      return reply.status(404).send({
        message: 'Lawyer not found or inconsistent data. Try again.',
      })
    }

    throw err
  }
}

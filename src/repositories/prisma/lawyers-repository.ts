import type { Lawyers } from '../../generated/prisma'
import { prisma } from '../../lib/prisma'
import type { CreateLawyerInput, LawyersInterface } from '../interfaces/lawyers'

export class PrismaLawyersRepository implements LawyersInterface {
  async findById(id: string) {
    const lawyer = await prisma.lawyers.findUnique({
      where: {
        id,
      },
    })

    return lawyer
  }

  async findByCpf(cpf: string) {
    const lawyer = await prisma.lawyers.findUnique({
      where: {
        cpf,
      },
    })

    return lawyer
  }

  async findByOab(oab: string) {
    const lawyer = await prisma.lawyers.findUnique({
      where: {
        oab,
      },
    })

    return lawyer
  }

  async create(data: CreateLawyerInput) {
    const lawyer = await prisma.lawyers.create({
      data,
    })

    return lawyer
  }

  async save(data: Lawyers) {
    const lawyer = await prisma.lawyers.update({
      where: {
        id: data.id,
      },
      data,
    })

    return lawyer
  }
}

import type { Lawyers } from '../../generated/prisma'

export interface CreateLawyerInput {
  name: string
  cpf: string
  oab: string
  email: string
  birth: string
  telephone: string
  informations_accepted?: Date
  registered?: Date
}

export interface LawyersInterface {
  findById(id: string): Promise<Lawyers | null>
  findByCpf(cpf: string): Promise<Lawyers | null>
  findByOab(oab: string): Promise<Lawyers | null>
  create(data: CreateLawyerInput): Promise<Lawyers>
  save(lawyer: Lawyers): Promise<Lawyers>
}

import type { MultipartFile } from '@fastify/multipart'
import readline from 'node:readline'
import { Readable } from 'node:stream'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { API_PROTHEUS_DATA, API_PROTHEUS_ST } from '../../lib/axios'
import type { LawyersInterface } from '../../repositories/interfaces/lawyers'
import { asyncPool } from '../../utils/async-pool'

interface CreateLawyersServiceRequest {
  file: MultipartFile | undefined
}

interface CreateLawyersServiceResponse {
  totalRegisters: number
  totalRegisteredLawyersInGoodStanding: number
  totalUnregisteredLawyersInBadStanding: number
  totalInvalidCpfLawyers: number
}

interface LawyersProps {
  name: string
  cpf: string
  oab: string
  email: string
  birth: string
  telephone: string
  informations_accepted: Date
  registered: Date
}

interface LawyersPropsApi {
  lawyer: {
    nome: string
    cpf: string
    registro: string
    dataNascimento: string
    email: string
    telefone: string
  }
}

export class CreateLawyersService {
  constructor(private lawyersInterface: LawyersInterface) {}

  async execute({ file }: CreateLawyersServiceRequest): Promise<CreateLawyersServiceResponse> {
    const buffer = await file?.toBuffer()
    const content = buffer?.toString('utf-8')

    dayjs.extend(utc)

    const readableFile = new Readable()

    readableFile.push(content)
    readableFile.push(null)

    const lawyersLine = readline.createInterface({
      input: readableFile,
    })

    const lawyers: LawyersProps[] = []

    let totalRegisteredLawyersInGoodStanding = 0
    let totalUnregisteredLawyersInBadStanding = 0
    let totalInvalidCpfLawyers = 0

    const cpfs = []

    // Filtra CPFs válidos, removendo espaços, linhas vazias e que tenham exatamente 11 caracteres
    for await (const cpf of lawyersLine) {
      const cleanCpf = cpf.trim()
      if (cleanCpf.length !== 11) {
        totalInvalidCpfLawyers++
      }

      if (cleanCpf && cleanCpf.length === 11) {
        cpfs.push(cleanCpf)
      }
    }

    // Executa chamadas na API com limite de 5 requisições simultâneas
    await asyncPool(5, cpfs, async cpf => {
      const lawyer = await this.lawyersInterface.findByCpf(cpf)

      if (lawyer) return

      const { data } = await API_PROTHEUS_DATA<LawyersPropsApi>('/', {
        params: {
          idOrg: 10,
          param: cpf,
        },
      })

      const formattedDateBirth = dayjs(data.lawyer.dataNascimento).utc().format('DDMMYYYY')

      lawyers.push({
        name: data.lawyer.nome,
        cpf: data.lawyer.cpf,
        oab: data.lawyer.registro,
        birth: formattedDateBirth,
        email: data.lawyer.email,
        telephone: data.lawyer.telefone,
        informations_accepted: dayjs().utc().toDate(),
        registered: dayjs().utc().toDate(),
      })
    })

    for await (const { name, cpf, oab, birth, email, telephone, informations_accepted, registered } of lawyers) {
      const { data } = await API_PROTHEUS_ST<boolean>(`/${cpf}`)

      if (data === false) {
        totalUnregisteredLawyersInBadStanding += 1
        continue
      }

      const lawyer = await this.lawyersInterface.findByCpf(cpf)

      if (lawyer) continue

      await this.lawyersInterface.create({
        name,
        cpf,
        oab,
        email,
        birth,
        telephone,
        informations_accepted,
        registered,
      })

      totalRegisteredLawyersInGoodStanding += 1
    }

    return {
      totalRegisters: cpfs.length + totalInvalidCpfLawyers, // Total found in CSV
      totalRegisteredLawyersInGoodStanding, // Total of compliant individuals inserted in the database
      totalUnregisteredLawyersInBadStanding, // Total not inserted (rejected by Protheus)
      totalInvalidCpfLawyers, // Total of invalid CPFs
    }
  }
}

import type { MultipartFile } from '@fastify/multipart'
import readline from 'node:readline'
import { Readable } from 'node:stream'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { API_PROTHEUS_DATA, API_PROTHEUS_ST } from '../../lib/axios'
import type { LawyersInterface } from '../../repositories/interfaces/lawyers'

interface CreateLawyersServiceRequest {
  file: MultipartFile | undefined
}

interface CreateLawyersServiceResponse {
  totalLawyers: number
  totalInserted: number
  totalNotInserted: number
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

    let totalNotInserted = 0
    let totalInserted = 0

    for await (const cpf of lawyersLine) {
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
    }

    for await (const { name, cpf, oab, birth, email, telephone, informations_accepted, registered } of lawyers) {
      const { data } = await API_PROTHEUS_ST<boolean>(`/${cpf}`)

      if (data === false) {
        totalNotInserted += 1
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

      totalInserted += 1
    }

    return {
      totalLawyers: lawyers.length, // Total found in CSV
      totalInserted, // Total of compliant individuals inserted in the database
      totalNotInserted, // Total not inserted (rejected by Protheus)
    }
  }
}

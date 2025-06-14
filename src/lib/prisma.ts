// Importa o cliente Prisma gerado automaticamente a partir do schema definido
import { PrismaClient } from '../generated/prisma'

// Função que cria uma nova instância do PrismaClient
const prismaClientSingleton = () => {
  return new PrismaClient()
}

// Estende o tipo de globalThis para incluir a propriedade prismaGlobal
declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>
} & typeof global

// Verifica se já existe uma instância do Prisma no escopo global;
// se não existir, cria uma nova instância
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

// Exporta a instância do Prisma para ser usada em outras partes da aplicação
export { prisma }

// Em ambiente de desenvolvimento, armazena a instância no escopo global
// para evitar a criação de múltiplas conexões com o banco de dados
if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma
}

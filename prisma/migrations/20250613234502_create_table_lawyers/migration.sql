-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MEMBER');

-- CreateTable
CREATE TABLE "lawyers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "oab" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "birth" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "informations_accepted" TIMESTAMP(3),
    "registered" TIMESTAMP(3),
    "role" "Role" NOT NULL DEFAULT 'MEMBER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lawyers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lawyers_cpf_key" ON "lawyers"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "lawyers_oab_key" ON "lawyers"("oab");

-- CreateIndex
CREATE UNIQUE INDEX "lawyers_email_key" ON "lawyers"("email");

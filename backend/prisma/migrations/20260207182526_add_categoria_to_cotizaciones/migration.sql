/*
  Warnings:

  - The values [EN_PROCESO,ENVIADO] on the enum `PedidoStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PedidoStatus_new" AS ENUM ('PENDIENTE', 'CONFIRMADO', 'ENTREGADO', 'CANCELADO');
ALTER TABLE "pedidos" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "pedidos" ALTER COLUMN "status" TYPE "PedidoStatus_new" USING ("status"::text::"PedidoStatus_new");
ALTER TYPE "PedidoStatus" RENAME TO "PedidoStatus_old";
ALTER TYPE "PedidoStatus_new" RENAME TO "PedidoStatus";
DROP TYPE "PedidoStatus_old";
ALTER TABLE "pedidos" ALTER COLUMN "status" SET DEFAULT 'PENDIENTE';
COMMIT;

-- AlterTable
ALTER TABLE "cotizaciones" ADD COLUMN     "categoria" TEXT NOT NULL DEFAULT 'General';

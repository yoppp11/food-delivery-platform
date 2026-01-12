/*
  Warnings:

  - The `status` column on the `orderStatusHistories` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "OrderStatusFieldHistory" AS ENUM ('CREATED', 'PAID', 'COMPLETED', 'ON_DELIVERY', 'PREPARING');

-- AlterTable
ALTER TABLE "orderStatusHistories" DROP COLUMN "status",
ADD COLUMN     "status" "OrderStatusFieldHistory" NOT NULL DEFAULT 'CREATED';

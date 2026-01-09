/*
  Warnings:

  - You are about to drop the column `total` on the `cartItems` table. All the data in the column will be lost.
  - Added the required column `basePrice` to the `cartItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemTotal` to the `cartItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `menuName` to the `cartItems` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CartStatus" AS ENUM ('ACTIVE', 'CHECKOUT', 'ORDER_CREATED', 'EXPIRED');

-- AlterTable
ALTER TABLE "cartItems" DROP COLUMN "total",
ADD COLUMN     "basePrice" INTEGER NOT NULL,
ADD COLUMN     "itemTotal" INTEGER NOT NULL,
ADD COLUMN     "menuName" TEXT NOT NULL,
ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "carts" ADD COLUMN     "notes" TEXT,
ADD COLUMN     "status" "CartStatus" NOT NULL DEFAULT 'ACTIVE';

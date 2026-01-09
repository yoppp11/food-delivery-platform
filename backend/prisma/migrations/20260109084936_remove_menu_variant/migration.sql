/*
  Warnings:

  - You are about to drop the column `variantId` on the `orderItems` table. All the data in the column will be lost.
  - You are about to drop the `menuVariants` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "menuVariants" DROP CONSTRAINT "menuVariants_menuId_fkey";

-- DropForeignKey
ALTER TABLE "orderItems" DROP CONSTRAINT "orderItems_variantId_fkey";

-- AlterTable
ALTER TABLE "orderItems" DROP COLUMN "variantId";

-- DropTable
DROP TABLE "menuVariants";

/*
  Warnings:

  - You are about to drop the column `menuId` on the `cartItems` table. All the data in the column will be lost.
  - You are about to drop the column `menuId` on the `orderItems` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "cartItems" DROP CONSTRAINT "cartItems_menuId_fkey";

-- DropForeignKey
ALTER TABLE "orderItems" DROP CONSTRAINT "orderItems_menuId_fkey";

-- AlterTable
ALTER TABLE "cartItems" DROP COLUMN "menuId";

-- AlterTable
ALTER TABLE "orderItems" DROP COLUMN "menuId";

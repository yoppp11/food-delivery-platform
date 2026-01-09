/*
  Warnings:

  - Added the required column `variantId` to the `cartItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variantId` to the `orderItems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cartItems" ADD COLUMN     "variantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "orderItems" ADD COLUMN     "variantId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "menuVariants" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "menuId" TEXT NOT NULL,

    CONSTRAINT "menuVariants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "menuVariants_id_key" ON "menuVariants"("id");

-- AddForeignKey
ALTER TABLE "menuVariants" ADD CONSTRAINT "menuVariants_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "menus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cartItems" ADD CONSTRAINT "cartItems_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "menuVariants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orderItems" ADD CONSTRAINT "orderItems_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "menuVariants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

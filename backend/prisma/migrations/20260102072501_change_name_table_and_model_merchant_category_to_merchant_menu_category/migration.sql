/*
  Warnings:

  - You are about to drop the `merchantCategories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "merchantCategories" DROP CONSTRAINT "merchantCategories_merchantId_fkey";

-- DropTable
DROP TABLE "merchantCategories";

-- CreateTable
CREATE TABLE "merchantMenuCategories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,

    CONSTRAINT "merchantMenuCategories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "merchantMenuCategories_id_key" ON "merchantMenuCategories"("id");

-- AddForeignKey
ALTER TABLE "merchantMenuCategories" ADD CONSTRAINT "merchantMenuCategories_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "merchants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

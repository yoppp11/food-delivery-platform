/*
  Warnings:

  - You are about to drop the `MerchantCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MerchantCategory" DROP CONSTRAINT "MerchantCategory_merchantId_fkey";

-- DropTable
DROP TABLE "MerchantCategory";

-- CreateTable
CREATE TABLE "merchantCategories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,

    CONSTRAINT "merchantCategories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "merchantCategories_id_key" ON "merchantCategories"("id");

-- AddForeignKey
ALTER TABLE "merchantCategories" ADD CONSTRAINT "merchantCategories_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "merchants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

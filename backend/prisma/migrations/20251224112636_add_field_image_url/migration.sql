/*
  Warnings:

  - Added the required column `imageUrl` to the `images` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "images" ADD COLUMN     "imageUrl" TEXT NOT NULL;

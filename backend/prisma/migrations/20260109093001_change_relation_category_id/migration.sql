-- DropForeignKey
ALTER TABLE "menus" DROP CONSTRAINT "menus_categoryId_fkey";

-- AddForeignKey
ALTER TABLE "menus" ADD CONSTRAINT "menus_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "merchantMenuCategories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

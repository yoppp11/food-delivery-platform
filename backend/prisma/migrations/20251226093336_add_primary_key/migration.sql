/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `deliveries` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `driverLocations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `driverReviews` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `drivers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `images` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `merchantReviews` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `notifications` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `orderPromotions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `orderStatusHistories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `paymentCallbacks` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `promotions` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "categories" ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "menuVariants" ADD CONSTRAINT "menuVariants_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "menus" ADD CONSTRAINT "menus_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "orderItems" ADD CONSTRAINT "orderItems_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "orders" ADD CONSTRAINT "orders_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "deliveries_id_key" ON "deliveries"("id");

-- CreateIndex
CREATE UNIQUE INDEX "driverLocations_id_key" ON "driverLocations"("id");

-- CreateIndex
CREATE UNIQUE INDEX "driverReviews_id_key" ON "driverReviews"("id");

-- CreateIndex
CREATE UNIQUE INDEX "drivers_id_key" ON "drivers"("id");

-- CreateIndex
CREATE UNIQUE INDEX "images_id_key" ON "images"("id");

-- CreateIndex
CREATE UNIQUE INDEX "merchantReviews_id_key" ON "merchantReviews"("id");

-- CreateIndex
CREATE UNIQUE INDEX "notifications_id_key" ON "notifications"("id");

-- CreateIndex
CREATE UNIQUE INDEX "orderPromotions_id_key" ON "orderPromotions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "orderStatusHistories_id_key" ON "orderStatusHistories"("id");

-- CreateIndex
CREATE UNIQUE INDEX "paymentCallbacks_id_key" ON "paymentCallbacks"("id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_id_key" ON "payments"("id");

-- CreateIndex
CREATE UNIQUE INDEX "promotions_id_key" ON "promotions"("id");

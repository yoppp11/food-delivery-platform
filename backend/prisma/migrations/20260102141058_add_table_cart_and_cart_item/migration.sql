-- CreateTable
CREATE TABLE "carts" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subtotal" INTEGER NOT NULL,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cartItems" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "menuId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,

    CONSTRAINT "cartItems_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "carts_id_key" ON "carts"("id");

-- CreateIndex
CREATE UNIQUE INDEX "cartItems_id_key" ON "cartItems"("id");

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "merchants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cartItems" ADD CONSTRAINT "cartItems_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cartItems" ADD CONSTRAINT "cartItems_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "menus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

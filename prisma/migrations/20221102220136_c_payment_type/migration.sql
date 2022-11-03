/*
  Warnings:

  - Added the required column `paymentTypeId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "PaymentType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cartId" TEXT NOT NULL,
    "stateId" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "paymentTypeId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "additionalInfo" TEXT,
    "total" INTEGER NOT NULL,
    CONSTRAINT "Order_paymentTypeId_fkey" FOREIGN KEY ("paymentTypeId") REFERENCES "PaymentType" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Order_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Order_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "OrderState" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Order_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "OrderType" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("additionalInfo", "cartId", "customerId", "id", "stateId", "total", "typeId") SELECT "additionalInfo", "cartId", "customerId", "id", "stateId", "total", "typeId" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE UNIQUE INDEX "Order_cartId_key" ON "Order"("cartId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

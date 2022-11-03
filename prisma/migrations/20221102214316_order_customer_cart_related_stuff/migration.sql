-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cartId" TEXT NOT NULL,
    "stateId" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "additionalInfo" TEXT,
    "total" INTEGER NOT NULL,
    CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Order_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Order_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "OrderState" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Order_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "OrderType" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OrderType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "OrderState" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cart" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT,
    "finalPrice" INTEGER NOT NULL
);
INSERT INTO "new_Cart" ("customerId", "finalPrice", "id") SELECT "customerId", "finalPrice", "id" FROM "Cart";
DROP TABLE "Cart";
ALTER TABLE "new_Cart" RENAME TO "Cart";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Order_cartId_key" ON "Order"("cartId");

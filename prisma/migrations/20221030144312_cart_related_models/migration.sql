-- CreateTable
CREATE TABLE "ProductStoreCart" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productStoreId" TEXT NOT NULL,
    "cartId" TEXT,
    "additionalInfo" TEXT,
    "amount" INTEGER NOT NULL,
    "finalPrice" INTEGER NOT NULL,
    CONSTRAINT "ProductStoreCart_productStoreId_fkey" FOREIGN KEY ("productStoreId") REFERENCES "ProductStore" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProductStoreCart_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProductStoreCartToOption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productStoreId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    CONSTRAINT "ProductStoreCartToOption_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProductStoreCartToOption_productStoreId_fkey" FOREIGN KEY ("productStoreId") REFERENCES "ProductStoreCart" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "finalPrice" INTEGER NOT NULL
);

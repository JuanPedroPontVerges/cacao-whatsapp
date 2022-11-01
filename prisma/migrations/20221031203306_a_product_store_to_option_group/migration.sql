/*
  Warnings:

  - Added the required column `amount` to the `ProductStoreCartToOption` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductStoreCartToOption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productStoreId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    CONSTRAINT "ProductStoreCartToOption_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProductStoreCartToOption_productStoreId_fkey" FOREIGN KEY ("productStoreId") REFERENCES "ProductStoreCart" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ProductStoreCartToOption" ("id", "optionId", "productStoreId") SELECT "id", "optionId", "productStoreId" FROM "ProductStoreCartToOption";
DROP TABLE "ProductStoreCartToOption";
ALTER TABLE "new_ProductStoreCartToOption" RENAME TO "ProductStoreCartToOption";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

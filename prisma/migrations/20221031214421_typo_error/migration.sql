/*
  Warnings:

  - You are about to drop the column `productStoreId` on the `ProductStoreCartToOption` table. All the data in the column will be lost.
  - Added the required column `productStoreCartId` to the `ProductStoreCartToOption` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductStoreCartToOption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productStoreCartId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    CONSTRAINT "ProductStoreCartToOption_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProductStoreCartToOption_productStoreCartId_fkey" FOREIGN KEY ("productStoreCartId") REFERENCES "ProductStoreCart" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ProductStoreCartToOption" ("amount", "id", "optionId") SELECT "amount", "id", "optionId" FROM "ProductStoreCartToOption";
DROP TABLE "ProductStoreCartToOption";
ALTER TABLE "new_ProductStoreCartToOption" RENAME TO "ProductStoreCartToOption";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

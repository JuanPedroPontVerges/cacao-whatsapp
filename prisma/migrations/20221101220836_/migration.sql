/*
  Warnings:

  - The primary key for the `ProductStoreCartToOption` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ProductStoreCartToOption` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductStoreCartToOption" (
    "productStoreCartId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,

    PRIMARY KEY ("productStoreCartId", "optionId"),
    CONSTRAINT "ProductStoreCartToOption_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProductStoreCartToOption_productStoreCartId_fkey" FOREIGN KEY ("productStoreCartId") REFERENCES "ProductStoreCart" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ProductStoreCartToOption" ("amount", "optionId", "productStoreCartId") SELECT "amount", "optionId", "productStoreCartId" FROM "ProductStoreCartToOption";
DROP TABLE "ProductStoreCartToOption";
ALTER TABLE "new_ProductStoreCartToOption" RENAME TO "ProductStoreCartToOption";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductStoreToOptionGroup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productStoreId" TEXT NOT NULL,
    "optionGroupId" TEXT NOT NULL,
    "displayTypeId" TEXT NOT NULL,
    "multipleUnits" BOOLEAN NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "amount" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "ProductStoreToOptionGroup_displayTypeId_fkey" FOREIGN KEY ("displayTypeId") REFERENCES "DisplayType" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProductStoreToOptionGroup_productStoreId_fkey" FOREIGN KEY ("productStoreId") REFERENCES "ProductStore" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProductStoreToOptionGroup_optionGroupId_fkey" FOREIGN KEY ("optionGroupId") REFERENCES "OptionGroup" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ProductStoreToOptionGroup" ("amount", "createdAt", "displayTypeId", "id", "multipleUnits", "optionGroupId", "productStoreId", "updatedAt") SELECT "amount", "createdAt", "displayTypeId", "id", "multipleUnits", "optionGroupId", "productStoreId", "updatedAt" FROM "ProductStoreToOptionGroup";
DROP TABLE "ProductStoreToOptionGroup";
ALTER TABLE "new_ProductStoreToOptionGroup" RENAME TO "ProductStoreToOptionGroup";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

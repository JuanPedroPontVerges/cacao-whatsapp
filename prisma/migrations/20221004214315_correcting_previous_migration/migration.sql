/*
  Warnings:

  - You are about to drop the column `address` on the `Menu` table. All the data in the column will be lost.
  - You are about to drop the column `googlePlaceId` on the `Menu` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Menu` table. All the data in the column will be lost.
  - Made the column `name` on table `Venue` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Menu" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "venueId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "Menu_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Menu" ("createdAt", "id", "updatedAt", "venueId") SELECT "createdAt", "id", "updatedAt", "venueId" FROM "Menu";
DROP TABLE "Menu";
ALTER TABLE "new_Menu" RENAME TO "Menu";
CREATE TABLE "new_OptionGroup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "menuId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "OptionGroup_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_OptionGroup" ("createdAt", "id", "menuId", "name", "updatedAt") SELECT "createdAt", "id", "menuId", "name", "updatedAt" FROM "OptionGroup";
DROP TABLE "OptionGroup";
ALTER TABLE "new_OptionGroup" RENAME TO "OptionGroup";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "venueId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" DATETIME,
    "image" TEXT,
    "menuId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "User_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_User" ("createdAt", "email", "emailVerified", "id", "image", "menuId", "name", "updatedAt", "venueId") SELECT "createdAt", "email", "emailVerified", "id", "image", "menuId", "name", "updatedAt", "venueId" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "new_Venue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "googlePlaceId" TEXT,
    "address" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);
INSERT INTO "new_Venue" ("address", "createdAt", "googlePlaceId", "id", "name", "updatedAt") SELECT "address", "createdAt", "googlePlaceId", "id", "name", "updatedAt" FROM "Venue";
DROP TABLE "Venue";
ALTER TABLE "new_Venue" RENAME TO "Venue";
CREATE UNIQUE INDEX "Venue_address_key" ON "Venue"("address");
CREATE TABLE "new_Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "menuId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "Category_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Category" ("createdAt", "id", "menuId", "name", "updatedAt") SELECT "createdAt", "id", "menuId", "name", "updatedAt" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
CREATE TABLE "new_Schedule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "menuSettingId" TEXT NOT NULL,
    "fromMinute" INTEGER,
    "fromHour" INTEGER,
    "toMinute" INTEGER,
    "toHour" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "Schedule_menuSettingId_fkey" FOREIGN KEY ("menuSettingId") REFERENCES "MenuSetting" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Schedule" ("createdAt", "fromHour", "fromMinute", "id", "menuSettingId", "toHour", "toMinute", "updatedAt") SELECT "createdAt", "fromHour", "fromMinute", "id", "menuSettingId", "toHour", "toMinute", "updatedAt" FROM "Schedule";
DROP TABLE "Schedule";
ALTER TABLE "new_Schedule" RENAME TO "Schedule";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

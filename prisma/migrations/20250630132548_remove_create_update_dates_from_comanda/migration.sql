/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Comanda` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Comanda` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Comanda" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" TEXT NOT NULL DEFAULT 'OPEN'
);
INSERT INTO "new_Comanda" ("id", "status") SELECT "id", "status" FROM "Comanda";
DROP TABLE "Comanda";
ALTER TABLE "new_Comanda" RENAME TO "Comanda";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

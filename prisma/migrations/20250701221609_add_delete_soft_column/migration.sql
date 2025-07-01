-- AlterTable
ALTER TABLE "Comanda" ADD COLUMN "deletedAt" DATETIME;

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN "deletedAt" DATETIME;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN "deletedAt" DATETIME;

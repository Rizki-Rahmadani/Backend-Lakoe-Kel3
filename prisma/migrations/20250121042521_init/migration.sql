/*
  Warnings:

  - Made the column `storesId` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_storesId_fkey";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "attachments" SET DATA TYPE TEXT,
ALTER COLUMN "storesId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_storesId_fkey" FOREIGN KEY ("storesId") REFERENCES "Stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

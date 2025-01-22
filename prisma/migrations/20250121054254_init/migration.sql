-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_storesId_fkey";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "storesId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_storesId_fkey" FOREIGN KEY ("storesId") REFERENCES "Stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

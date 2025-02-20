-- AlterTable
ALTER TABLE "Orders" ADD COLUMN     "destination_email" TEXT,
ADD COLUMN     "draft_order_id" TEXT,
ADD COLUMN     "origin_email" TEXT,
ADD COLUMN     "productId" TEXT,
ALTER COLUMN "storeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

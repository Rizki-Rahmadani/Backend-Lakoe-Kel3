/*
  Warnings:

  - You are about to drop the column `receiver_address` on the `Invoices` table. All the data in the column will be lost.
  - You are about to drop the column `receiver_latitude` on the `Invoices` table. All the data in the column will be lost.
  - You are about to drop the column `receiver_longitude` on the `Invoices` table. All the data in the column will be lost.
  - You are about to drop the column `biteshipId` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `moota_transaction_id` on the `Payments` table. All the data in the column will be lost.
  - Added the required column `receiver_city` to the `Invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiver_detailAddress` to the `Invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiver_email` to the `Invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiver_postalCode` to the `Invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiver_province` to the `Invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiver_subDistrict` to the `Invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `service_charge` to the `Invoices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invoice_histories" ALTER COLUMN "status" SET DEFAULT 'pending',
ALTER COLUMN "status" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Invoices" DROP COLUMN "receiver_address",
DROP COLUMN "receiver_latitude",
DROP COLUMN "receiver_longitude",
ADD COLUMN     "order_id" TEXT,
ADD COLUMN     "receiver_biteship_area_id" TEXT,
ADD COLUMN     "receiver_city" TEXT NOT NULL,
ADD COLUMN     "receiver_detailAddress" TEXT NOT NULL,
ADD COLUMN     "receiver_email" TEXT NOT NULL,
ADD COLUMN     "receiver_postalCode" TEXT NOT NULL,
ADD COLUMN     "receiver_province" TEXT NOT NULL,
ADD COLUMN     "receiver_subDistrict" TEXT NOT NULL,
ADD COLUMN     "service_charge" INTEGER NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'pending',
ALTER COLUMN "status" SET DATA TYPE TEXT,
ALTER COLUMN "invoice_number" DROP NOT NULL,
ALTER COLUMN "cartsId" DROP NOT NULL,
ALTER COLUMN "paymentsId" DROP NOT NULL,
ALTER COLUMN "courierId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "biteshipId",
ADD COLUMN     "biteship_area_id" TEXT,
ADD COLUMN     "biteship_location_id" TEXT;

-- AlterTable
ALTER TABLE "Payments" DROP COLUMN "moota_transaction_id",
ADD COLUMN     "midtrans_transaction_id" TEXT,
ALTER COLUMN "status" SET DEFAULT 'pending',
ALTER COLUMN "status" SET DATA TYPE TEXT,
ALTER COLUMN "invoicesId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Orders" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "receiver_name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "biteship_order_id" TEXT,
    "storeId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Orders_id_key" ON "Orders"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Orders_order_id_key" ON "Orders"("order_id");

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `productId` on the `Categories` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Stores` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Cart_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Carts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Confirmation_payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Couriers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Decoration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Invoice_histories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Message_templates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Operation_hours` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Roles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Stores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Stores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Stores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Stores_on_decorations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Variant_option_values` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `weight` on the `Variant_option_values` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updatedAt` to the `Variant_options` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Variants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `bank_accounts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Categories" DROP CONSTRAINT "Categories_productId_fkey";

-- DropIndex
DROP INDEX "Stores_name_key";

-- DropIndex
DROP INDEX "Variants_productId_key";

-- AlterTable
ALTER TABLE "Cart_items" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Carts" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Categories" DROP COLUMN "productId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "parentId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Confirmation_payment" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Couriers" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Decoration" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Invoice_histories" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Invoices" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "biteshipId" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Message_templates" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Operation_hours" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Payments" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "attachments" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Profiles" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Roles" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Stores" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL,
ALTER COLUMN "logo_attachment" SET DATA TYPE TEXT,
ALTER COLUMN "banner_attachment" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Stores_on_decorations" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "phone_number" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Variant_option_values" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "weight",
ADD COLUMN     "weight" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Variant_options" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Variants" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "bank_accounts" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "_CategoriesToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CategoriesToProduct_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CategoriesToProduct_B_index" ON "_CategoriesToProduct"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Stores_userId_key" ON "Stores"("userId");

-- AddForeignKey
ALTER TABLE "Stores" ADD CONSTRAINT "Stores_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categories" ADD CONSTRAINT "Categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoriesToProduct" ADD CONSTRAINT "_CategoriesToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoriesToProduct" ADD CONSTRAINT "_CategoriesToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

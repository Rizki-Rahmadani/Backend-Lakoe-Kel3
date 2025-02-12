/*
  Warnings:

  - You are about to drop the column `variant_optionsId` on the `Variant_option_values` table. All the data in the column will be lost.
  - You are about to drop the column `parentVariantOptionId` on the `Variant_options` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[url]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sku]` on the table `Variant_option_values` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `url` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Variant_option_values" DROP CONSTRAINT "Variant_option_values_variant_optionsId_fkey";

-- DropForeignKey
ALTER TABLE "Variant_options" DROP CONSTRAINT "Variant_options_parentVariantOptionId_fkey";

-- AlterTable
ALTER TABLE "Categories" ADD COLUMN     "icon" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Variant_option_values" DROP COLUMN "variant_optionsId";

-- AlterTable
ALTER TABLE "Variant_options" DROP COLUMN "parentVariantOptionId";

-- CreateTable
CREATE TABLE "VariantOptionValueToOptions" (
    "variant_option_value_id" TEXT NOT NULL,
    "variant_option_id" TEXT NOT NULL,

    CONSTRAINT "VariantOptionValueToOptions_pkey" PRIMARY KEY ("variant_option_value_id","variant_option_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_url_key" ON "Product"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Variant_option_values_sku_key" ON "Variant_option_values"("sku");

-- AddForeignKey
ALTER TABLE "VariantOptionValueToOptions" ADD CONSTRAINT "VariantOptionValueToOptions_variant_option_value_id_fkey" FOREIGN KEY ("variant_option_value_id") REFERENCES "Variant_option_values"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VariantOptionValueToOptions" ADD CONSTRAINT "VariantOptionValueToOptions_variant_option_id_fkey" FOREIGN KEY ("variant_option_id") REFERENCES "Variant_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

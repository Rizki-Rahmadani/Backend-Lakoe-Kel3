/*
  Warnings:

  - A unique constraint covering the columns `[sku,variant_optionsId]` on the table `Variant_option_values` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Variant_option_values_sku_variant_optionsId_key" ON "Variant_option_values"("sku", "variant_optionsId");

-- AlterTable
ALTER TABLE "Variant_options" ADD COLUMN     "parentVariantOptionId" TEXT;

-- AddForeignKey
ALTER TABLE "Variant_options" ADD CONSTRAINT "Variant_options_parentVariantOptionId_fkey" FOREIGN KEY ("parentVariantOptionId") REFERENCES "Variant_options"("id") ON DELETE SET NULL ON UPDATE CASCADE;

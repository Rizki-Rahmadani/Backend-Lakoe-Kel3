/*
  Warnings:

  - Added the required column `courierId` to the `Invoices` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Cart_items" DROP CONSTRAINT "Cart_items_cartsId_fkey";

-- DropForeignKey
ALTER TABLE "Cart_items" DROP CONSTRAINT "Cart_items_storesId_fkey";

-- DropForeignKey
ALTER TABLE "Cart_items" DROP CONSTRAINT "Cart_items_userId_fkey";

-- DropForeignKey
ALTER TABLE "Cart_items" DROP CONSTRAINT "Cart_items_variant_option_valuesId_fkey";

-- DropForeignKey
ALTER TABLE "Categories" DROP CONSTRAINT "Categories_productId_fkey";

-- DropForeignKey
ALTER TABLE "Confirmation_payment" DROP CONSTRAINT "Confirmation_payment_invoicesId_fkey";

-- DropForeignKey
ALTER TABLE "Couriers" DROP CONSTRAINT "Couriers_invoicesId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice_histories" DROP CONSTRAINT "Invoice_histories_invoicesId_fkey";

-- DropForeignKey
ALTER TABLE "Invoices" DROP CONSTRAINT "Invoices_cartsId_fkey";

-- DropForeignKey
ALTER TABLE "Invoices" DROP CONSTRAINT "Invoices_paymentsId_fkey";

-- DropForeignKey
ALTER TABLE "Invoices" DROP CONSTRAINT "Invoices_userId_fkey";

-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_profilesId_fkey";

-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_storesId_fkey";

-- DropForeignKey
ALTER TABLE "Message_templates" DROP CONSTRAINT "Message_templates_storesId_fkey";

-- DropForeignKey
ALTER TABLE "Operation_hours" DROP CONSTRAINT "Operation_hours_storesId_fkey";

-- DropForeignKey
ALTER TABLE "Payments" DROP CONSTRAINT "Payments_userId_fkey";

-- DropForeignKey
ALTER TABLE "Profiles" DROP CONSTRAINT "Profiles_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Stores_on_decorations" DROP CONSTRAINT "Stores_on_decorations_storesId_fkey";

-- DropForeignKey
ALTER TABLE "Variant_option_values" DROP CONSTRAINT "Variant_option_values_variant_optionsId_fkey";

-- DropForeignKey
ALTER TABLE "Variant_options" DROP CONSTRAINT "Variant_options_variantsId_fkey";

-- DropForeignKey
ALTER TABLE "Variants" DROP CONSTRAINT "Variants_productId_fkey";

-- DropForeignKey
ALTER TABLE "bank_accounts" DROP CONSTRAINT "bank_accounts_storesId_fkey";

-- AlterTable
ALTER TABLE "Invoices" ADD COLUMN     "courierId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Profiles" ADD CONSTRAINT "Profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_storesId_fkey" FOREIGN KEY ("storesId") REFERENCES "Stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_storesId_fkey" FOREIGN KEY ("storesId") REFERENCES "Stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_profilesId_fkey" FOREIGN KEY ("profilesId") REFERENCES "Profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Variant_option_values" ADD CONSTRAINT "Variant_option_values_variant_optionsId_fkey" FOREIGN KEY ("variant_optionsId") REFERENCES "Variant_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Variant_options" ADD CONSTRAINT "Variant_options_variantsId_fkey" FOREIGN KEY ("variantsId") REFERENCES "Variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Variants" ADD CONSTRAINT "Variants_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categories" ADD CONSTRAINT "Categories_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart_items" ADD CONSTRAINT "Cart_items_cartsId_fkey" FOREIGN KEY ("cartsId") REFERENCES "Carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart_items" ADD CONSTRAINT "Cart_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart_items" ADD CONSTRAINT "Cart_items_storesId_fkey" FOREIGN KEY ("storesId") REFERENCES "Stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart_items" ADD CONSTRAINT "Cart_items_variant_option_valuesId_fkey" FOREIGN KEY ("variant_option_valuesId") REFERENCES "Variant_option_values"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoices" ADD CONSTRAINT "Invoices_cartsId_fkey" FOREIGN KEY ("cartsId") REFERENCES "Carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoices" ADD CONSTRAINT "Invoices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoices" ADD CONSTRAINT "Invoices_paymentsId_fkey" FOREIGN KEY ("paymentsId") REFERENCES "Payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Confirmation_payment" ADD CONSTRAINT "Confirmation_payment_invoicesId_fkey" FOREIGN KEY ("invoicesId") REFERENCES "Invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice_histories" ADD CONSTRAINT "Invoice_histories_invoicesId_fkey" FOREIGN KEY ("invoicesId") REFERENCES "Invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Couriers" ADD CONSTRAINT "Couriers_invoicesId_fkey" FOREIGN KEY ("invoicesId") REFERENCES "Invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stores_on_decorations" ADD CONSTRAINT "Stores_on_decorations_storesId_fkey" FOREIGN KEY ("storesId") REFERENCES "Stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Operation_hours" ADD CONSTRAINT "Operation_hours_storesId_fkey" FOREIGN KEY ("storesId") REFERENCES "Stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message_templates" ADD CONSTRAINT "Message_templates_storesId_fkey" FOREIGN KEY ("storesId") REFERENCES "Stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

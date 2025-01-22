/*
  Warnings:

  - The `discount` column on the `Carts` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Carts" DROP COLUMN "discount",
ADD COLUMN     "discount" INTEGER;

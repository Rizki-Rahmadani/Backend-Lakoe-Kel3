/*
  Warnings:

  - You are about to drop the column `size` on the `Product` table. All the data in the column will be lost.
  - The `attachments` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[username]` on the table `Stores` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `height` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `length` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "size",
ADD COLUMN     "height" INTEGER NOT NULL,
ADD COLUMN     "length" INTEGER NOT NULL,
ADD COLUMN     "weight" INTEGER NOT NULL,
ADD COLUMN     "width" INTEGER NOT NULL,
DROP COLUMN "attachments",
ADD COLUMN     "attachments" TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "Stores_username_key" ON "Stores"("username");

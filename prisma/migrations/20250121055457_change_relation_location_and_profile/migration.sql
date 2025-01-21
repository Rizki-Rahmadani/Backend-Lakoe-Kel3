/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `Profiles` will be added. If there are existing duplicate values, this will fail.
  - Made the column `user_id` on table `Profiles` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Profiles" DROP CONSTRAINT "Profiles_locationId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_profilesId_fkey";

-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "profilesId" TEXT;

-- AlterTable
ALTER TABLE "Profiles" ALTER COLUMN "user_id" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Profiles_user_id_key" ON "Profiles"("user_id");

-- AddForeignKey
ALTER TABLE "Profiles" ADD CONSTRAINT "Profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_profilesId_fkey" FOREIGN KEY ("profilesId") REFERENCES "Profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

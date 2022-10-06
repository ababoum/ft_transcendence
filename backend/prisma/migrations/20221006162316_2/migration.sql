/*
  Warnings:

  - You are about to drop the column `ownerId` on the `ChatRoom` table. All the data in the column will be lost.
  - Added the required column `ownerEmail` to the `ChatRoom` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ChatRoom" DROP CONSTRAINT "ChatRoom_ownerId_fkey";

-- AlterTable
ALTER TABLE "ChatRoom" DROP COLUMN "ownerId",
ADD COLUMN     "ownerEmail" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ChatRoom" ADD CONSTRAINT "ChatRoom_ownerEmail_fkey" FOREIGN KEY ("ownerEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

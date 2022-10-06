/*
  Warnings:

  - You are about to drop the column `banListId` on the `ChatRoom` table. All the data in the column will be lost.
  - You are about to drop the column `muteListId` on the `ChatRoom` table. All the data in the column will be lost.
  - You are about to drop the column `participantId` on the `ChatRoom` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ChatRoom" DROP CONSTRAINT "ChatRoom_banListId_fkey";

-- DropForeignKey
ALTER TABLE "ChatRoom" DROP CONSTRAINT "ChatRoom_muteListId_fkey";

-- DropForeignKey
ALTER TABLE "ChatRoom" DROP CONSTRAINT "ChatRoom_participantId_fkey";

-- AlterTable
ALTER TABLE "ChatRoom" DROP COLUMN "banListId",
DROP COLUMN "muteListId",
DROP COLUMN "participantId";

-- CreateTable
CREATE TABLE "_ParticipantTable" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_BanTable" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_MuteTable" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ParticipantTable_AB_unique" ON "_ParticipantTable"("A", "B");

-- CreateIndex
CREATE INDEX "_ParticipantTable_B_index" ON "_ParticipantTable"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BanTable_AB_unique" ON "_BanTable"("A", "B");

-- CreateIndex
CREATE INDEX "_BanTable_B_index" ON "_BanTable"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MuteTable_AB_unique" ON "_MuteTable"("A", "B");

-- CreateIndex
CREATE INDEX "_MuteTable_B_index" ON "_MuteTable"("B");

-- AddForeignKey
ALTER TABLE "_ParticipantTable" ADD CONSTRAINT "_ParticipantTable_A_fkey" FOREIGN KEY ("A") REFERENCES "ChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParticipantTable" ADD CONSTRAINT "_ParticipantTable_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BanTable" ADD CONSTRAINT "_BanTable_A_fkey" FOREIGN KEY ("A") REFERENCES "ChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BanTable" ADD CONSTRAINT "_BanTable_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MuteTable" ADD CONSTRAINT "_MuteTable_A_fkey" FOREIGN KEY ("A") REFERENCES "ChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MuteTable" ADD CONSTRAINT "_MuteTable_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

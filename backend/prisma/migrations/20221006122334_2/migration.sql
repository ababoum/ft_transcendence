/*
  Warnings:

  - You are about to drop the `_ChatRoomToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ChatRoomToUser" DROP CONSTRAINT "_ChatRoomToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ChatRoomToUser" DROP CONSTRAINT "_ChatRoomToUser_B_fkey";

-- DropTable
DROP TABLE "_ChatRoomToUser";

-- CreateTable
CREATE TABLE "_AdminTable" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AdminTable_AB_unique" ON "_AdminTable"("A", "B");

-- CreateIndex
CREATE INDEX "_AdminTable_B_index" ON "_AdminTable"("B");

-- AddForeignKey
ALTER TABLE "_AdminTable" ADD CONSTRAINT "_AdminTable_A_fkey" FOREIGN KEY ("A") REFERENCES "ChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdminTable" ADD CONSTRAINT "_AdminTable_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

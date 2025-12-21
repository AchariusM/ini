/*
  Warnings:

  - You are about to drop the column `feedbackId` on the `laporan` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[laporanId]` on the table `feedback` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `laporan` DROP FOREIGN KEY `laporan_feedbackId_fkey`;

-- DropIndex
DROP INDEX `laporan_feedbackId_key` ON `laporan`;

-- AlterTable
ALTER TABLE `feedback` ADD COLUMN `laporanId` INTEGER NULL;

-- AlterTable
ALTER TABLE `laporan` DROP COLUMN `feedbackId`;

-- CreateIndex
CREATE UNIQUE INDEX `feedback_laporanId_key` ON `feedback`(`laporanId`);

-- AddForeignKey
ALTER TABLE `feedback` ADD CONSTRAINT `feedback_laporanId_fkey` FOREIGN KEY (`laporanId`) REFERENCES `laporan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

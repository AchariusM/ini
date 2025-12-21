/*
  Warnings:

  - You are about to drop the column `laporanId` on the `feedback` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[feedbackId]` on the table `laporan` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `feedback` DROP FOREIGN KEY `feedback_laporanId_fkey`;

-- DropIndex
DROP INDEX `feedback_laporanId_key` ON `feedback`;

-- AlterTable
ALTER TABLE `feedback` DROP COLUMN `laporanId`;

-- AlterTable
ALTER TABLE `laporan` ADD COLUMN `feedbackId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `laporan_feedbackId_key` ON `laporan`(`feedbackId`);

-- AddForeignKey
ALTER TABLE `laporan` ADD CONSTRAINT `laporan_feedbackId_fkey` FOREIGN KEY (`feedbackId`) REFERENCES `feedback`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

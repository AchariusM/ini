/*
  Warnings:

  - You are about to drop the column `feedbackId` on the `laporan` table. All the data in the column will be lost.
  - You are about to drop the column `judul` on the `laporan` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[laporanId]` on the table `feedback` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `laporan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `laporan` DROP FOREIGN KEY `laporan_feedbackId_fkey`;

-- DropIndex
DROP INDEX `laporan_feedbackId_key` ON `laporan`;

-- AlterTable
ALTER TABLE `feedback` ADD COLUMN `laporanId` INTEGER NULL;

-- AlterTable
ALTER TABLE `laporan` DROP COLUMN `feedbackId`,
    DROP COLUMN `judul`,
    ADD COLUMN `tanggal` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `feedback_laporanId_key` ON `feedback`(`laporanId`);

-- AddForeignKey
ALTER TABLE `feedback` ADD CONSTRAINT `feedback_laporanId_fkey` FOREIGN KEY (`laporanId`) REFERENCES `laporan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

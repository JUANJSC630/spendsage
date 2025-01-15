/*
  Warnings:

  - You are about to drop the column `ListPaymentScheduleId` on the `PaymentSchedule` table. All the data in the column will be lost.
  - Added the required column `listPaymentScheduleId` to the `PaymentSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PaymentSchedule" DROP CONSTRAINT "PaymentSchedule_ListPaymentScheduleId_fkey";

-- DropIndex
DROP INDEX "PaymentSchedule_ListPaymentScheduleId_idx";

-- AlterTable
ALTER TABLE "PaymentSchedule" DROP COLUMN "ListPaymentScheduleId",
ADD COLUMN     "listPaymentScheduleId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "PaymentSchedule_listPaymentScheduleId_idx" ON "PaymentSchedule"("listPaymentScheduleId");

-- AddForeignKey
ALTER TABLE "PaymentSchedule" ADD CONSTRAINT "PaymentSchedule_listPaymentScheduleId_fkey" FOREIGN KEY ("listPaymentScheduleId") REFERENCES "ListPaymentSchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

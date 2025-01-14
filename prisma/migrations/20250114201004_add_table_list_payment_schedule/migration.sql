/*
  Warnings:

  - Added the required column `ListPaymentScheduleId` to the `PaymentSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PaymentSchedule" ADD COLUMN     "ListPaymentScheduleId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ListPaymentSchedule" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ListPaymentSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PaymentSchedule_ListPaymentScheduleId_idx" ON "PaymentSchedule"("ListPaymentScheduleId");

-- CreateIndex
CREATE INDEX "PaymentSchedule_userId_idx" ON "PaymentSchedule"("userId");

-- AddForeignKey
ALTER TABLE "PaymentSchedule" ADD CONSTRAINT "PaymentSchedule_ListPaymentScheduleId_fkey" FOREIGN KEY ("ListPaymentScheduleId") REFERENCES "ListPaymentSchedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

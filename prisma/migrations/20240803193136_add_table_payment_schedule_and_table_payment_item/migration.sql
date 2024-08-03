/*
  Warnings:

  - You are about to drop the column `amount` on the `PaymentSchedule` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `PaymentSchedule` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `PaymentSchedule` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `PaymentSchedule` table. All the data in the column will be lost.
  - You are about to drop the column `frequency` on the `PaymentSchedule` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `PaymentSchedule` table. All the data in the column will be lost.
  - Added the required column `date` to the `PaymentSchedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `PaymentSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PaymentSchedule" DROP COLUMN "amount",
DROP COLUMN "category",
DROP COLUMN "description",
DROP COLUMN "endDate",
DROP COLUMN "frequency",
DROP COLUMN "startDate",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "PaymentItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "paymentScheduleId" TEXT NOT NULL,
    "check" BOOLEAN NOT NULL,
    "amount" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PaymentItem_paymentScheduleId_idx" ON "PaymentItem"("paymentScheduleId");

-- CreateIndex
CREATE INDEX "PaymentItem_userId_idx" ON "PaymentItem"("userId");

-- AddForeignKey
ALTER TABLE "PaymentItem" ADD CONSTRAINT "PaymentItem_paymentScheduleId_fkey" FOREIGN KEY ("paymentScheduleId") REFERENCES "PaymentSchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

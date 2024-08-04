/*
  Warnings:

  - You are about to drop the column `date` on the `PaymentSchedule` table. All the data in the column will be lost.
  - Added the required column `fromDate` to the `PaymentSchedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toDate` to the `PaymentSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PaymentSchedule" DROP COLUMN "date",
ADD COLUMN     "fromDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "toDate" TIMESTAMP(3) NOT NULL;

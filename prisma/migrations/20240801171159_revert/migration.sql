/*
  Warnings:

  - Changed the type of `category` on the `Transactions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('INCOME', 'FIXED_EXPENSE', 'VARIABLE_EXPENSE');

-- AlterTable
ALTER TABLE "Transactions" DROP COLUMN "category",
ADD COLUMN     "category" "Category" NOT NULL;

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Category_isDefault_idx" ON "Category"("isDefault");

-- CreateIndex
CREATE INDEX "Category_slug_isDefault_idx" ON "Category"("slug", "isDefault");

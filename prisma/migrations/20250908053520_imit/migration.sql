/*
  Warnings:

  - You are about to drop the column `productVariantId` on the `CartItems` table. All the data in the column will be lost.
  - You are about to drop the column `productVariantId` on the `OrderItems` table. All the data in the column will be lost.
  - Added the required column `skuId` to the `CartItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `skuId` to the `OrderItems` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."CartItems" DROP CONSTRAINT "CartItems_productVariantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."OrderItems" DROP CONSTRAINT "OrderItems_productVariantId_fkey";

-- AlterTable
ALTER TABLE "public"."CartItems" DROP COLUMN "productVariantId",
ADD COLUMN     "skuId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."OrderItems" DROP COLUMN "productVariantId",
ADD COLUMN     "skuId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."CartItems" ADD CONSTRAINT "CartItems_skuId_fkey" FOREIGN KEY ("skuId") REFERENCES "public"."Sku"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderItems" ADD CONSTRAINT "OrderItems_skuId_fkey" FOREIGN KEY ("skuId") REFERENCES "public"."Sku"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `shippingAddressId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `isShippingAddress` on the `UserAddress` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `Coupon` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `defaultAddress` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_shippingAddressId_fkey";

-- AlterTable
ALTER TABLE "public"."Order" DROP COLUMN "shippingAddressId",
ADD COLUMN     "defaultAddress" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "phone" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."UserAddress" DROP COLUMN "isShippingAddress",
ADD COLUMN     "defaultAddress" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_code_key" ON "public"."Coupon"("code");

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_defaultAddress_fkey" FOREIGN KEY ("defaultAddress") REFERENCES "public"."UserAddress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

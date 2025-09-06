-- CreateEnum
CREATE TYPE "public"."AddressType" AS ENUM ('HOME', 'WORK', 'OTHER');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "otp" TEXT,
ADD COLUMN     "otpExpiry" TEXT,
ALTER COLUMN "lastLogin" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."UserAddress" ADD COLUMN     "addressType" "public"."AddressType" NOT NULL DEFAULT 'HOME';

-- CreateTable
CREATE TABLE "public"."Wishlist" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wishlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WishlistItem" (
    "id" SERIAL NOT NULL,
    "wishListId" INTEGER NOT NULL,
    "skuId" INTEGER NOT NULL,

    CONSTRAINT "WishlistItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_userId_key" ON "public"."Wishlist"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "WishlistItem_wishListId_skuId_key" ON "public"."WishlistItem"("wishListId", "skuId");

-- AddForeignKey
ALTER TABLE "public"."Wishlist" ADD CONSTRAINT "Wishlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WishlistItem" ADD CONSTRAINT "WishlistItem_wishListId_fkey" FOREIGN KEY ("wishListId") REFERENCES "public"."Wishlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WishlistItem" ADD CONSTRAINT "WishlistItem_skuId_fkey" FOREIGN KEY ("skuId") REFERENCES "public"."Sku"("id") ON DELETE CASCADE ON UPDATE CASCADE;

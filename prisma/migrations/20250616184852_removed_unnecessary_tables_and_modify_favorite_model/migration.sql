/*
  Warnings:

  - You are about to drop the column `image` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_productId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- AlterTable
ALTER TABLE "Favorite" DROP COLUMN "image",
DROP COLUMN "name",
DROP COLUMN "price",
DROP COLUMN "productId",
DROP COLUMN "slug",
ADD COLUMN     "items" JSON[] DEFAULT ARRAY[]::JSON[];

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "VerificationToken";

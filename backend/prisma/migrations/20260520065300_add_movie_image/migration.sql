/*
  Warnings:

  - You are about to drop the column `year` on the `Movie` table. All the data in the column will be lost.
  - Added the required column `yearReleased` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "year",
ADD COLUMN     "yearReleased" INTEGER NOT NULL;

/*
  Warnings:

  - You are about to alter the column `metrosQuadrados` on the `imovel` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `imovel` MODIFY `metrosQuadrados` DOUBLE NOT NULL;

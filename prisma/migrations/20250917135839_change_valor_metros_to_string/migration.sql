/*
  Warnings:

  - You are about to alter the column `valor` on the `imovel` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.
  - You are about to alter the column `metrosQuadrados` on the `imovel` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `imovel` MODIFY `valor` VARCHAR(191) NOT NULL,
    MODIFY `metrosQuadrados` VARCHAR(191) NOT NULL;

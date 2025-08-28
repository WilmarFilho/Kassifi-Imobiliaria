-- CreateTable
CREATE TABLE `Usuario` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Usuario_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Imovel` (
    `id` VARCHAR(191) NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `lancamento` BOOLEAN NOT NULL,
    `valor` DOUBLE NOT NULL,
    `cidade` VARCHAR(191) NOT NULL,
    `estado` VARCHAR(191) NOT NULL,
    `endereco` VARCHAR(191) NOT NULL,
    `quartos` INTEGER NOT NULL,
    `banheiros` INTEGER NOT NULL,
    `vagas` INTEGER NOT NULL,
    `metrosQuadrados` INTEGER NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tag` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Tag_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ImovelTag` (
    `id` VARCHAR(191) NOT NULL,
    `imovelId` VARCHAR(191) NOT NULL,
    `tagId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ImovelTag_imovelId_tagId_key`(`imovelId`, `tagId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Midia` (
    `id` VARCHAR(191) NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `imovelId` VARCHAR(191) NOT NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ImovelTag` ADD CONSTRAINT `ImovelTag_imovelId_fkey` FOREIGN KEY (`imovelId`) REFERENCES `Imovel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ImovelTag` ADD CONSTRAINT `ImovelTag_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `Tag`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Midia` ADD CONSTRAINT `Midia_imovelId_fkey` FOREIGN KEY (`imovelId`) REFERENCES `Imovel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

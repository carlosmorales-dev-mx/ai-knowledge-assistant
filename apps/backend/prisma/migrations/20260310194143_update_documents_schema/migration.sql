/*
  Warnings:

  - You are about to drop the column `title` on the `documents` table. All the data in the column will be lost.
  - Added the required column `filename` to the `documents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "document_chunks" ADD COLUMN     "vectorId" TEXT;

-- AlterTable
ALTER TABLE "documents" DROP COLUMN "title",
ADD COLUMN     "chunkCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "errorMessage" TEXT,
ADD COLUMN     "filename" TEXT NOT NULL,
ADD COLUMN     "processedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "document_chunks_documentId_chunkIndex_idx" ON "document_chunks"("documentId", "chunkIndex");

-- CreateIndex
CREATE INDEX "documents_userId_createdAt_idx" ON "documents"("userId", "createdAt");

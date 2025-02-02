-- DropForeignKey
ALTER TABLE "DocumentFile" DROP CONSTRAINT "DocumentFile_documentId_fkey";

-- DropForeignKey
ALTER TABLE "DocumentFile" DROP CONSTRAINT "DocumentFile_fileId_fkey";

-- AddForeignKey
ALTER TABLE "DocumentFile" ADD CONSTRAINT "DocumentFile_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentFile" ADD CONSTRAINT "DocumentFile_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;

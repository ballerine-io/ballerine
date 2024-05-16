ALTER TABLE "AlertDefinition" ADD COLUMN "label" TEXT NOT NULL DEFAULT substr(md5(random()::text), 0, 10);
ALTER TABLE "AlertDefinition" ALTER COLUMN "label" DROP DEFAULT;
CREATE UNIQUE INDEX "AlertDefinition_label_projectId_key" ON "AlertDefinition"("label", "projectId");

ALTER TABLE "WorkflowDefinition"
ADD CONSTRAINT "isPublic_projectId_check"
CHECK (("isPublic" = true AND "projectId" IS NULL) OR ("isPublic" = false));

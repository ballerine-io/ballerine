ALTER TABLE "WorkflowDefinition"
ADD CONSTRAINT "isTemplate_projectId_check"
CHECK (("isTemplate" = true AND "projectId" IS NULL) OR ("isTemplate" = false));

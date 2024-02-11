-- AlterTable
ALTER TABLE "Alert" ADD COLUMN     "assigneeAt" TIMESTAMP(3);

CREATE OR REPLACE FUNCTION UpdateAssigneeAtFunction()
RETURNS TRIGGER AS $$
BEGIN
    NEW."assigneeAt" := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER UpdateAssigneeAtTrigger
BEFORE UPDATE ON "Alert"
FOR EACH ROW
WHEN (OLD."assigneeId" IS DISTINCT FROM NEW."assigneeId")
EXECUTE FUNCTION UpdateAssigneeAtFunction();
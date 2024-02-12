-- AlterTable
ALTER TABLE "Alert" ADD COLUMN     "assignedAt" TIMESTAMP(3);

CREATE OR REPLACE FUNCTION UpdateassignedAtFunction()
RETURNS TRIGGER AS $$
BEGIN
    NEW."assignedAt" := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER UpdateassignedAtTrigger
BEFORE UPDATE ON "Alert"
FOR EACH ROW
WHEN (OLD."assigneeId" IS DISTINCT FROM NEW."assigneeId")
EXECUTE FUNCTION UpdateassignedAtFunction();
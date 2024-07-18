/*
  Warnings:

  - You are about to drop the column `operator` on the `Rule` table. All the data in the column will be lost.
  - Added the required column `operation` to the `Rule` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "WorkflowDefinitionRiskRulePolicy_workflowDefinitionId_key";

-- AlterTable
ALTER TABLE "Rule" DROP COLUMN "operator",
ADD COLUMN     "operation" TEXT NOT NULL;

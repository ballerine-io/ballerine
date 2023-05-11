-- CreateIndex
CREATE INDEX "Business_companyName_idx" ON "Business"("companyName");

-- CreateIndex
CREATE INDEX "Business_countryOfIncorporation_idx" ON "Business"("countryOfIncorporation");

-- CreateIndex
CREATE INDEX "Business_taxIdentificationNumber_idx" ON "Business"("taxIdentificationNumber");

-- CreateIndex
CREATE INDEX "Business_vatNumber_idx" ON "Business"("vatNumber");

-- CreateIndex
CREATE INDEX "Business_approvalState_idx" ON "Business"("approvalState");

-- CreateIndex
CREATE INDEX "EndUser_endUserType_idx" ON "EndUser"("endUserType");

-- CreateIndex
CREATE INDEX "EndUser_createdAt_idx" ON "EndUser"("createdAt");

-- CreateIndex
CREATE INDEX "EndUser_firstName_idx" ON "EndUser"("firstName");

-- CreateIndex
CREATE INDEX "EndUser_correlationId_idx" ON "EndUser"("correlationId");

-- CreateIndex
CREATE INDEX "EndUser_approvalState_idx" ON "EndUser"("approvalState");

-- CreateIndex
CREATE INDEX "EndUsersOnBusinesses_businessId_idx" ON "EndUsersOnBusinesses"("businessId");

-- CreateIndex
CREATE INDEX "EndUsersOnBusinesses_endUserId_idx" ON "EndUsersOnBusinesses"("endUserId");

-- CreateIndex
CREATE INDEX "File_userId_idx" ON "File"("userId");

-- CreateIndex
CREATE INDEX "Policy_name_idx" ON "Policy"("name");

-- CreateIndex
CREATE INDEX "Policy_version_name_idx" ON "Policy"("version", "name");

-- CreateIndex
CREATE INDEX "WorkflowDefinition_name_version_idx" ON "WorkflowDefinition"("name", "version");

-- CreateIndex
CREATE INDEX "WorkflowDefinition_definitionType_idx" ON "WorkflowDefinition"("definitionType");

-- CreateIndex
CREATE INDEX "WorkflowRuntimeData_endUserId_status_idx" ON "WorkflowRuntimeData"("endUserId", "status");

-- CreateIndex
CREATE INDEX "WorkflowRuntimeData_businessId_status_idx" ON "WorkflowRuntimeData"("businessId", "status");

-- CreateIndex
CREATE INDEX "WorkflowRuntimeData_workflowDefinitionId_status_idx" ON "WorkflowRuntimeData"("workflowDefinitionId", "status");

-- CreateIndex
CREATE INDEX "WorkflowRuntimeData_state_idx" ON "WorkflowRuntimeData"("state");

-- CreateIndex
CREATE INDEX "WorkflowRuntimeData_createdBy_idx" ON "WorkflowRuntimeData"("createdBy");

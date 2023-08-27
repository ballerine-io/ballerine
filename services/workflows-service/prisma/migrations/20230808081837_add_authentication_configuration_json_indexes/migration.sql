-- CreateIndex
CREATE INDEX "Customer_authenticationConfiguration_idx" ON "Customer" USING GIN ("authenticationConfiguration" jsonb_path_ops);

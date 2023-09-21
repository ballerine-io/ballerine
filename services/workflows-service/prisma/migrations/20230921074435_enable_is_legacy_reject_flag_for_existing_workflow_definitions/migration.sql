UPDATE "WorkflowDefinition" SET "config" = jsonb_set(COALESCE("config", '{}'::jsonb), '{isLegacyReject}', 'true'::jsonb);

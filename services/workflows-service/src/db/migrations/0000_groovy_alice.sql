DO $$ BEGIN
 CREATE TYPE "ApprovalState" AS ENUM('NEW', 'APPROVED', 'REJECTED', 'PROCESSING');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "WorkflowRuntimeDataStatus" AS ENUM('active', 'completed', 'failed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Business" (
	"id" text PRIMARY KEY NOT NULL,
	"correlationId" text,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	"companyName" varchar NOT NULL,
	"registrationNumber" varchar,
	"legalForm" varchar,
	"country" varchar,
	"countryOfIncorporation" varchar,
	"dateOfIncorporation" timestamp,
	"address" json,
	"phoneNumber" varchar,
	"email" varchar,
	"website" varchar,
	"industry" varchar,
	"taxIdentificationNumber" varchar,
	"vatNumber" varchar,
	"shareholderStructure" json,
	"numberOfEmployees" integer,
	"businessPurpose" varchar,
	"documents" json,
	"avatarUrl" varchar,
	"additionalInfo" json,
	"bankInformation" json,
	"approvalState" "ApprovalState" DEFAULT 'APPROVED',
	CONSTRAINT "Business_correlationId_unique" UNIQUE("correlationId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "EndUser" (
	"id" text PRIMARY KEY NOT NULL,
	"isContactPerson" boolean DEFAULT false,
	"correlationId" varchar,
	"endUserType" varchar DEFAULT 'individual',
	"approvalState" "ApprovalState" DEFAULT 'APPROVED',
	"stateReason" varchar,
	"firstName" varchar NOT NULL,
	"lastName" varchar NOT NULL,
	"email" text,
	"phone" varchar,
	"country" varchar,
	"dateOfBirth" timestamp,
	"avatarUrl" varchar,
	"nationalId" varchar,
	"additionalInfo" json,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "EndUser_correlationId_unique" UNIQUE("correlationId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "EndUsersOnBusinesses" (
	"endUserId" text NOT NULL,
	"businessId" text NOT NULL,
	CONSTRAINT EndUsersOnBusinesses_endUserId_businessId PRIMARY KEY("endUserId","businessId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Entities" (
	"id" text PRIMARY KEY NOT NULL,
	"firstName" varchar NOT NULL,
	"lastName" varchar NOT NULL,
	"email" text NOT NULL,
	"phone" varchar,
	"password" varchar NOT NULL,
	"roles" json NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "Entities_email_unique" UNIQUE("email"),
	CONSTRAINT "Entities_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "File" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"fileNameOnDisk" varchar NOT NULL,
	"uri" varchar NOT NULL,
	"fileNameInBucket" varchar,
	"createdAt" timestamp DEFAULT now(),
	"createdBy" varchar DEFAULT 'SYSTEM'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Filter" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"entity" varchar NOT NULL,
	"query" json NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	"createdBy" varchar DEFAULT 'SYSTEM',
	CONSTRAINT "Filter_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Policy" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"version" integer NOT NULL,
	"tasks" json NOT NULL,
	"rulesSets" json NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "User" (
	"id" text PRIMARY KEY NOT NULL,
	"firstName" varchar NOT NULL,
	"lastName" varchar NOT NULL,
	"email" text NOT NULL,
	"phone" varchar,
	"password" varchar NOT NULL,
	"roles" json,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	"lastActiveAt" timestamp,
	CONSTRAINT "User_email_unique" UNIQUE("email"),
	CONSTRAINT "User_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "WorkflowDefinition" (
	"id" text PRIMARY KEY NOT NULL,
	"reviewMachineId" text,
	"name" varchar NOT NULL,
	"version" integer DEFAULT 1,
	"definitionType" varchar NOT NULL,
	"definition" json NOT NULL,
	"contextSchema" json,
	"config" json,
	"supportedPlatforms" json,
	"extensions" json,
	"backend" json,
	"persistStates" json,
	"submitStates" json,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	"createdBy" varchar DEFAULT 'SYSTEM'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "WorkflowRuntimeData" (
	"id" text PRIMARY KEY NOT NULL,
	"endUserId" text,
	"businessId" text,
	"assigneeId" text,
	"workflowDefinitionId" text NOT NULL,
	"workflowDefinitionVersion" integer NOT NULL,
	"context" json NOT NULL,
	"config" json,
	"state" varchar,
	"status" "WorkflowRuntimeDataStatus" DEFAULT 'active',
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	"createdBy" varchar DEFAULT 'SYSTEM',
	"resolvedAt" timestamp,
	"assignedAt" timestamp,
	"parent_runtime_data_id" text
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Business_companyName_idx" ON "Business" ("companyName");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Business_approvalState_idx" ON "Business" ("approvalState");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Business_correlationId_idx" ON "Business" ("correlationId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "EndUser_endUserType_idx" ON "EndUser" ("endUserType");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "EndUser_approvalState_idx" ON "EndUser" ("approvalState");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "EndUser_createdAt_idx" ON "EndUser" ("createdAt");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "EndUsersOnBusinesses" ADD CONSTRAINT "EndUsersOnBusinesses_endUserId_EndUser_id_fk" FOREIGN KEY ("endUserId") REFERENCES "EndUser"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "EndUsersOnBusinesses" ADD CONSTRAINT "EndUsersOnBusinesses_businessId_Business_id_fk" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WorkflowRuntimeData" ADD CONSTRAINT "WorkflowRuntimeData_endUserId_EndUser_id_fk" FOREIGN KEY ("endUserId") REFERENCES "EndUser"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WorkflowRuntimeData" ADD CONSTRAINT "WorkflowRuntimeData_businessId_Business_id_fk" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WorkflowRuntimeData" ADD CONSTRAINT "WorkflowRuntimeData_assigneeId_User_id_fk" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

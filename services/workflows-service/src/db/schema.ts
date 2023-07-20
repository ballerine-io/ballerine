import {
  boolean,
  index,
  integer,
  json,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { InferModel, relations } from 'drizzle-orm';

export const Roles = ['admin', 'user'] as const;

export const ApprovalState = {
  APPROVED: 'APPROVED',
  NEW: 'NEW',
  PROCESSING: 'PROCESSING',
  REJECTED: 'REJECTED',
};

export const ApprovalStates = [
  ApprovalState.NEW,
  ApprovalState.APPROVED,
  ApprovalState.REJECTED,
  ApprovalState.PROCESSING,
] as const;

export const approvalStateEnum = pgEnum('ApprovalState', ApprovalStates);

export const WorkflowRuntimeDataStatus = {
  active: 'active',
  completed: 'completed',
  failed: 'failed',
} as const;

export const WorkflowRuntimeDataStatuses = [
  WorkflowRuntimeDataStatus.active,
  WorkflowRuntimeDataStatus.completed,
  WorkflowRuntimeDataStatus.failed,
] as const;

export const workflowRuntimeDataStatusEnum = pgEnum(
  'WorkflowRuntimeDataStatus',
  WorkflowRuntimeDataStatuses,
);

export const user = pgTable('User', {
  id: text('id').primaryKey(),
  firstName: varchar('firstName').notNull(),
  lastName: varchar('lastName').notNull(),
  email: text('email').unique().notNull(),
  phone: varchar('phone').unique(),
  password: varchar('password').notNull(),
  roles: json('roles').$type<typeof Roles>(),

  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
  lastActiveAt: timestamp('lastActiveAt'),
});

export const entities = pgTable('Entities', {
  id: text('id').primaryKey(),
  firstName: varchar('firstName').notNull(),
  lastName: varchar('lastName').notNull(),
  email: text('email').unique().notNull(),
  phone: varchar('phone').unique(),
  password: varchar('password').notNull(),
  roles: json('roles').notNull(),

  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const endUser = pgTable(
  'EndUser',
  {
    id: text('id').primaryKey(),
    isContactPerson: boolean('isContactPerson').default(false),

    correlationId: varchar('correlationId').unique(),

    endUserType: varchar('endUserType').default('individual'), // Add userType: can be 'EndUser', 'CompanyContact', 'Stakeholder'
    approvalState: approvalStateEnum('approvalState').default(ApprovalState.APPROVED),
    stateReason: varchar('stateReason'),

    firstName: varchar('firstName').notNull(),
    lastName: varchar('lastName').notNull(),
    email: text('email'),
    phone: varchar('phone'),
    country: varchar('country'),
    dateOfBirth: timestamp('dateOfBirth'),
    avatarUrl: varchar('avatarUrl'),
    nationalId: varchar('nationalId'),
    additionalInfo: json('additionalInfo'),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt').defaultNow(),
  },
  table => ({
    endUserTypeIdx: index('EndUser_endUserType_idx').on(table.endUserType),
    approvalStateIdx: index('EndUser_approvalState_idx').on(table.approvalState),
    createdAtIdx: index('EndUser_createdAt_idx').on(table.createdAt),
  }),
);

export const endUsersOnBusinesses = pgTable(
  'EndUsersOnBusinesses',
  {
    endUserId: text('endUserId')
      .notNull()
      .references(() => endUser.id),
    businessId: text('businessId')
      .notNull()
      .references(() => business.id),
  },
  table => ({
    pk: primaryKey(table.endUserId, table.businessId),
  }),
);

export const business = pgTable(
  'Business',
  {
    id: text('id').primaryKey(), // Unique identifier for the business entity
    correlationId: text('correlationId').unique(),

    createdAt: timestamp('createdAt').defaultNow(), // Timestamp for when the business entity was created
    updatedAt: timestamp('updatedAt').defaultNow(), // Timestamp for when the business entity was last updated
    companyName: varchar('companyName').notNull(), // Official registered name of the business entity
    registrationNumber: varchar('registrationNumber'), // Unique registration number assigned by the relevant authorities
    legalForm: varchar('legalForm'), // Legal structure of the business entity, e.g., LLC, corporation, partnership
    country: varchar('country'),
    countryOfIncorporation: varchar('countryOfIncorporation'), // Country where the business entity is incorporated
    dateOfIncorporation: timestamp('dateOfIncorporation'), // Date when the business entity was incorporated
    address: json('address'), // Registered address of the business entity
    phoneNumber: varchar('phoneNumber'), // Contact phone number of the business entity
    email: varchar('email'), // Contact email of the business entity
    website: varchar('website'), // Official website of the business entity
    industry: varchar('industry'), // Industry sector the business entity operates in
    taxIdentificationNumber: varchar('taxIdentificationNumber'), // Unique tax identification number assigned by the tax authorities
    vatNumber: varchar('vatNumber'), // Unique VAT (Value Added Tax) number for the business entity
    shareholderStructure: json('shareholderStructure'), // Information about the ownership structure, including shareholders and their ownership percentages
    numberOfEmployees: integer('numberOfEmployees'), // Number of employees working for the business entity
    businessPurpose: varchar('businessPurpose'), // Brief description of the business entity's purpose or main activities
    documents: json('documents'), // Collection of documents required for the KYB process, e.g., registration documents, financial statements
    avatarUrl: varchar('avatarUrl'),
    additionalInfo: json('additionalInfo'),
    bankInformation: json('bankInformation'),
    approvalState: approvalStateEnum('approvalState').default(ApprovalState.APPROVED), // Current status of the KYB process for the business entity
  },
  table => ({
    companyNameIdx: index('Business_companyName_idx').on(table.companyName),
    approvalState: index('Business_approvalState_idx').on(table.approvalState),
    correlationId: index('Business_correlationId_idx').on(table.correlationId),
  }),
);

export const workflowDefinition = pgTable('WorkflowDefinition', {
  id: text('id').primaryKey(),
  reviewMachineId: text('reviewMachineId'),
  name: varchar('name').notNull(),
  version: integer('version').default(1),

  definitionType: varchar('definitionType').notNull(),
  definition: json('definition').notNull(),
  contextSchema: json('contextSchema'),
  config: json('config'),
  supportedPlatforms: json('supportedPlatforms'),
  extensions: json('extensions'),

  backend: json('backend'),
  persistStates: json('persistStates'),
  submitStates: json('submitStates'),

  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
  createdBy: varchar('createdBy').default('SYSTEM'),
});

export const workflowRuntimeData = pgTable('WorkflowRuntimeData', {
  id: text('id').primaryKey(),
  endUserId: text('endUserId').references(() => endUser.id),
  businessId: text('businessId').references(() => business.id),
  assigneeId: text('assigneeId').references(() => user.id),
  workflowDefinitionId: text('workflowDefinitionId').notNull(),
  workflowDefinitionVersion: integer('workflowDefinitionVersion').notNull(),
  context: json('context').notNull(),
  config: json('config'),
  // history
  state: varchar('state'),
  status: workflowRuntimeDataStatusEnum('status').default(WorkflowRuntimeDataStatus.active),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
  createdBy: varchar('createdBy').default('SYSTEM'),
  resolvedAt: timestamp('resolvedAt'),
  assignedAt: timestamp('assignedAt'),
  parentRuntimeDataId: text('parent_runtime_data_id'),
});

export const file = pgTable('File', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  fileNameOnDisk: varchar('fileNameOnDisk').notNull(),
  uri: varchar('uri').notNull(),
  fileNameInBucket: varchar('fileNameInBucket'),
  createdAt: timestamp('createdAt').defaultNow(),
  createdBy: varchar('createdBy').default('SYSTEM'),
});

export const policy = pgTable('Policy', {
  id: text('id').primaryKey(),
  name: varchar('name').notNull(),
  version: integer('version').notNull(),
  tasks: json('tasks').notNull(),
  rulesSets: json('rulesSets').notNull(),
});

export const filter = pgTable('Filter', {
  id: text('id').primaryKey(),
  // Name of the filter i.e. "KYC"
  name: varchar('name').unique().notNull(),
  // Does the filter belong to EndUser or Business?
  entity: varchar('entity').notNull(),
  // 1:1 with Drizzle's select object
  // Example: { select: { id: true, firstName: true, lastName: true }, where: { id: { equals: "123" } } }
  query: json('query').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
  createdBy: varchar('createdBy').default('SYSTEM'),
});

export const workflowDefinitionRelations = relations(workflowDefinition, ({ many }) => ({
  workflowRuntimeData: many(workflowRuntimeData),
}));

export const workflowRuntimeDataRelations = relations(workflowRuntimeData, ({ one, many }) => ({
  endUser: one(endUser),
  business: one(business),
  assignee: one(user),
  workflowDefinition: one(workflowDefinition),
  parentWorkflowRuntimeData: one(workflowRuntimeData),
  childWorkflowsRuntimeData: many(workflowRuntimeData),
}));

export const businessRelations = relations(business, ({ many }) => ({
  workflowRuntimeData: many(workflowRuntimeData),
  endUsers: many(endUser),
  endUsersOnBusinesses: many(endUsersOnBusinesses),
}));

export type Business = InferModel<typeof business, 'select'>;
export type BusinessCreate = InferModel<typeof business, 'insert'>;

export const endUsersOnBusinessesRelations = relations(endUsersOnBusinesses, ({ one }) => ({
  endUser: one(endUser),
  business: one(business),
}));

export const endUserRelations = relations(endUser, ({ many }) => ({
  workflowRuntimeData: many(workflowRuntimeData),
  businesses: many(business),
  endUsersOnBusinesses: many(endUsersOnBusinesses),
}));

export const usersRelations = relations(user, ({ many }) => ({
  workflowRuntimeData: many(workflowRuntimeData),
}));

export type WorkflowRuntimeDataStatusType = (typeof WorkflowRuntimeDataStatuses)[number];
export type ApprovalStateType = (typeof ApprovalStates)[number];

export type User = InferModel<typeof user, 'select'>;
export type UserCreate = InferModel<typeof user, 'insert'>;

export type EndUser = InferModel<typeof endUser, 'select'>;
export type EndUserCreate = InferModel<typeof endUser, 'insert'>;

export type Entity = InferModel<typeof entities, 'select'>;
export type EntityCreate = InferModel<typeof entities, 'insert'>;

export type EndUsersOnBusinesses = InferModel<typeof endUsersOnBusinesses, 'select'>;
export type EndUsersOnBusinessesCreate = InferModel<typeof endUsersOnBusinesses, 'insert'>;

export type WorkflowDefinition = InferModel<typeof workflowDefinition, 'select'>;
export type WorkflowDefinitionCreate = InferModel<typeof workflowDefinition, 'insert'>;

export type WorkflowRuntimeData = InferModel<typeof workflowRuntimeData, 'select'>;
export type WorkflowRuntimeDataCreate = InferModel<typeof workflowRuntimeData, 'insert'>;

export type File = InferModel<typeof file, 'select'>;
export type FileCreate = InferModel<typeof file, 'insert'>;

export type Policy = InferModel<typeof policy, 'select'>;
export type PolicyCreate = InferModel<typeof policy, 'insert'>;

export type Filter = InferModel<typeof filter, 'select'>;
export type FilterCreate = InferModel<typeof filter, 'insert'>;

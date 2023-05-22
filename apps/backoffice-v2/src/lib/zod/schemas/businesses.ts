import { z } from 'zod';
import { CaseStatuses, State, States } from '../../../enums';
import { ObjectWithIdSchema } from '../utils/object-with-id';

export const BusinessesListSchema = z
  .array(
    ObjectWithIdSchema.extend({
      companyName: z.string().default(''),
      registrationNumber: z.string().nullable().default(''),
      legalForm: z.string().nullable().default(''),
      countryOfIncorporation: z.string().nullable().default(''),
      createdAt: z.string().default(''),
      approvalState: z.enum(States).default(State.PROCESSING),
      workflowRuntimeData: z.preprocess(
        workflows => workflows?.[0],
        ObjectWithIdSchema.extend({
          assigneeId: z.string().nullable().optional(),
          createdAt: z.string().datetime(),
          status: z.enum(CaseStatuses),
        }).optional(),
      ),
    }),
  )
  .default([]);

export const BusinessByIdSchema = ObjectWithIdSchema.extend({
  companyName: z.string().default(''),
  registrationNumber: z.string().default(''),
  legalForm: z.string().nullable().default(''),
  countryOfIncorporation: z.string().nullable().default(''),
  dateOfIncorporation: z.string().nullable().default(''),
  address: z.string().nullable().default(''),
  phoneNumber: z.string().nullable().default(''),
  email: z.string().nullable().default(''),
  website: z.string().nullable().default(''),
  industry: z.string().nullable().default(''),
  taxIdentificationNumber: z.string().nullable().default(''),
  vatNumber: z.string().nullable().default(''),
  shareholderStructure: z.string().nullable().default(''),
  numberOfEmployees: z.number().nullable().default(0),
  businessPurpose: z.string().nullable().default(''),
  // documents: z
  //   .array(
  //     z.object({
  //       url: z.string(),
  //       doctype: z.string(),
  //     }),
  //   )
  //   .default([]),
  documents: z.any(),
  approvalState: z.enum(States).default(State.PROCESSING),
  createdAt: z.string().default(''),
  updatedAt: z.string().default(''),
}).default({});

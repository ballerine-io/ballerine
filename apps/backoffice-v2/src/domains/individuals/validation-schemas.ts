import { z } from 'zod';
import { ObjectWithIdSchema } from '../../lib/zod/utils/object-with-id/object-with-id';
import { State, States } from '../../common/enums';

export const IndividualByIdSchema = ObjectWithIdSchema.extend({
  avatarUrl: z.string().nullable().default(''),
  createdAt: z.string().default(''),
  firstName: z.string().nullable().default(''),
  middleName: z.string().nullable().default(''),
  lastName: z.string().default(''),
  fullName: z.string().default(''),
  endUserType: z.string().nullable().default('individual'),
  email: z.string().nullable().default(''),
  phone: z.string().nullable().default(''),
  approvalState: z.enum(States).default(State.PROCESSING),
  dateOfBirth: z.string().nullable().default(''),
  placeOfBirth: z.string().nullable().default(''),
  sex: z.union([z.literal('male'), z.literal('female'), z.literal('other')]).default('other'),
  passport: z
    .object({
      type: z.string().default(''),
      authority: z.string().default(''),
      placeOfIssue: z.string().default(''),
      dateOfIssue: z.string().default(''),
      expires: z.string().default(''),
    })
    .optional(),

  checkResults: z
    .object({
      finalResult: z.enum(States).default(State.PROCESSING),
      scannedBy: z.string().default(''),
      amlCheck: z.enum(States).default(State.PROCESSING),
      idCheck: z.enum(States).default(State.PROCESSING),
      selfieCheck: z.enum(States).default(State.PROCESSING),
    })
    .default({}),
  address: z
    .object({
      city: z.string().default(''),
      country: z.string().default(''),
      street: z.string().default(''),
      // Could be 21 A.
      houseNum: z.string().default(''),
      aptNum: z.string().default(''),
      zipCode: z.string().default(''),
    })
    .optional(),
  // Array of images
  documents: z
    .array(
      z.object({
        url: z.string(),
        // i.e 'passport', 'facefront'
        doctype: z.string(),
      }),
    )
    .default([]),
})
  .transform(({ firstName, lastName, ...rest }) => ({
    ...rest,
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
  }))
  .default({});

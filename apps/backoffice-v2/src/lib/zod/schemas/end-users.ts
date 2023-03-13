import { z } from 'zod';
import { State, States } from '../../../enums';

export const EndUsersListSchema = z.object({
  endUsers: z
    .array(
      z.object({
        id: z.string(),
        avatarUrl: z.string().default(''),
        createdAt: z.string().default(''),
        firstName: z.string().nullable().default(''),
        middleName: z.string().default(''),
        lastName: z.string().nullable().default(''),
        fullName: z.string().default(''),
        email: z.string().nullable().default(''),
        phone: z.string().nullable().default(''),
        state: z.enum(States).default(State.PENDING),
        assignedTo: z.string().default(''),
        endUserType: z.string().nullable().default(''),
      }),
    )
    .default([]),
});

export const EndUserByIdSchema = z.object({
  endUser: z
    .object({
      id: z.string().uuid(),
      avatarUrl: z.string().default(''),
      clientId: z.string().uuid(),
      createdAt: z.string().default(''),
      firstName: z.string().nullable().default(''),
      middleName: z.string().default(''),
      lastName: z.string().nullable().default(''),
      fullName: z.string().default(''),
      endUserType: z.string().nullable().default('individual'),
      email: z.string().nullable().default(''),
      phone: z.string().nullable().default(''),
      state: z.enum(States).default(State.PENDING),
      dateOfBirth: z.string().default(''),
      placeOfBirth: z.string().default(''),
      assignedTo: z.string().default(''),
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
      checkResults: z.object({
        finalResult: z.enum(States).default(State.PENDING),
        scannedBy: z.string().default(''),
        amlCheck: z.enum(States).default(State.PENDING),
        idCheck: z.enum(States).default(State.PENDING),
        selfieCheck: z.enum(States).default(State.PENDING),
      }),
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
    .default({}),
});

import { Static, Type } from '@sinclair/typebox';

const entitySchema = Type.Object(
  {
    type: Type.String({ enum: ['individual', 'business'] }),
    data: Type.Optional(
      Type.Object(
        {
          additionalInfo: Type.Optional(Type.Object({})),
        },
        { additionalProperties: true },
      ),
    ),
  },
  { additionalProperties: false },
);

export const defaultContextSchema = Type.Object({
  aml: Type.Optional(Type.Unknown()),
  entity: Type.Union([
    Type.Composite([entitySchema, Type.Object({ id: Type.String() })]),
    Type.Composite([entitySchema, Type.Object({ ballerineEntityId: Type.String() })]),
  ]),
  documents: Type.Array(
    Type.Object(
      {
        id: Type.Optional(Type.String()),
        category: Type.String({
          transform: ['trim', 'toLowerCase'],
        }),
        type: Type.String({
          transform: ['trim', 'toLowerCase'],
        }),
        issuer: Type.Object(
          {
            type: Type.Optional(Type.String()),
            name: Type.Optional(Type.String()),
            country: Type.String({
              transform: ['trim', 'toUpperCase'],
            }),
            city: Type.Optional(Type.String()),
            additionalInfo: Type.Optional(Type.Object({})),
          },
          {
            additionalProperties: false,
          },
        ),
        issuingVersion: Type.Optional(Type.Number()),
        decision: Type.Optional(
          Type.Object(
            {
              status: Type.Optional(
                Type.Union([
                  Type.String({
                    enum: ['new', 'pending', 'revision', 'approved', 'rejected'],
                  }),
                  Type.Null(),
                ]),
              ),
              rejectionReason: Type.Optional(
                Type.Union([
                  Type.String(),
                  Type.String({
                    enum: [
                      'Suspicious document',
                      'Document does not match customer profile',
                      'Potential identity theft',
                      'Fake or altered document',
                      'Document on watchlist or blacklist',
                    ],
                  }),
                ]),
              ),
              revisionReason: Type.Optional(
                Type.Union([
                  Type.String(),
                  Type.String({
                    enum: [
                      'Wrong category',
                      'Spam',
                      'Ownership mismatch - Name',
                      'Ownership mismatch - National ID',
                      'Bad image quality',
                      'Missing page',
                      'Invalid document',
                      'Expired document',
                      'Password protected',
                      'Blurry image',
                      'Short statement period',
                      'Document out of range',
                      'Outside restricted area',
                      'Other',
                      'Partial information',
                    ],
                  }),
                ]),
              ),
            },
            { additionalProperties: false },
          ),
        ),
        version: Type.Optional(Type.Number()),
        pages: Type.Array(
          Type.Union([
            Type.Object(
              {
                ballerineFileId: Type.String(),
                type: Type.Optional(
                  Type.String({
                    enum: [
                      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                      'application/vnd.ms-excel',
                      'text/csv',
                      'application/csv',
                      'application/pdf',
                      'image/png',
                      'image/jpg',
                      'image/jpeg',
                      // Backwards compatibility
                      'pdf',
                      'png',
                      'jpg',
                    ],
                  }),
                ),
                fileName: Type.Optional(Type.String()),
              },
              { additionalProperties: false },
            ),
            Type.Object(
              {
                ballerineFileId: Type.Optional(Type.String()),
                provider: Type.String({
                  enum: ['gcs', 'http', 'stream', 'file-system', 'ftp', 'base64'],
                }),
                uri: Type.String({ format: 'uri' }),
                type: Type.Optional(
                  Type.String({
                    enum: [
                      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                      'application/vnd.ms-excel',
                      'text/csv',
                      'application/csv',
                      'application/pdf',
                      'image/png',
                      'image/jpg',
                      'image/jpeg',
                      // Backwards compatibility
                      'pdf',
                      'png',
                      'jpg',
                    ],
                  }),
                ),
                fileName: Type.Optional(Type.String()),
                data: Type.Optional(Type.String()),
                metadata: Type.Optional(
                  Type.Object(
                    {
                      side: Type.Optional(Type.String()),
                      pageNumber: Type.Optional(Type.String()),
                    },
                    { additionalProperties: false },
                  ),
                ),
              },
              { additionalProperties: false },
            ),
          ]),
        ),
        properties: Type.Object({
          email: Type.Optional(Type.String({ format: 'email' })),
          expiryDate: Type.Optional(Type.String({ format: 'date' })),
          idNumber: Type.Optional(Type.String()),
        }),
      },
      {
        additionalProperties: false,
      },
    ),
  ),
});

export type DefaultContextSchema = Static<typeof defaultContextSchema>;

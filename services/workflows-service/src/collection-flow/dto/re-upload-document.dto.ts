import { Type } from '@sinclair/typebox';

export const ReuploadDocumentDtoSchema = Type.Object({
  file: Type.Object({
    fieldname: Type.String(),
    originalname: Type.String(),
    encoding: Type.String(),
    mimetype: Type.String(),
    size: Type.Number(),
    destination: Type.String(),
    filename: Type.String(),
    path: Type.String(),
    buffer: Type.Optional(Type.Any()),
  }),
});

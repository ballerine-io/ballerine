import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { Type } from '@sinclair/typebox';

export function ApiValidationErrorResponse() {
  return applyDecorators(
    ApiResponse({
      status: 400,
      description: 'Validation error',
      schema: Type.Object({
        errorCode: Type.Literal('BadRequest'),
        message: Type.String(),
        statusCode: Type.Literal(400),
        timestamp: Type.String({
          format: 'date-time',
        }),
        path: Type.String(),
        errors: Type.Array(Type.Object({ message: Type.String(), path: Type.String() })),
      }),
    }),
  );
}

import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { Type } from '@sinclair/typebox';

export const ApiValidationErrorResponse = () => {
  return applyDecorators(
    ApiResponse({
      status: 400,
      description: 'Validation error',
      schema: Type.Object({
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
};

export const ApiUnauthorizedErrorResponse = () => {
  return applyDecorators(
    ApiResponse({
      status: 401,
      schema: Type.Object({
        message: Type.Literal('Unauthorized'),
        statusCode: Type.Literal(401),
        path: Type.String(),
        timestamp: Type.String({
          format: 'date-time',
        }),
      }),
    }),
  );
};

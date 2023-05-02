import { Prisma } from '@prisma/client';
import { isRecordNotFoundError, PRISMA_RECORD_NOT_FOUND_ERROR } from './prisma.util';

describe('isRecordNotFoundError', () => {
  test('returns true for record not found error', () => {
    expect(
      isRecordNotFoundError(
        new Prisma.PrismaClientKnownRequestError(
          `Error occurred during query execution:
          InterpretationError("Error for binding '0': RecordNotFound("Record to update not found.")")`,
          {
            code: PRISMA_RECORD_NOT_FOUND_ERROR,
            clientVersion: '0.0.0',
          },
        ),
      ),
    ).toBe(true);
  });
  test('returns false for any other error', () => {
    expect(isRecordNotFoundError(new Error())).toBe(false);
  });
});

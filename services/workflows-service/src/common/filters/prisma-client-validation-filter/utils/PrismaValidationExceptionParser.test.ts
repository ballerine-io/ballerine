import { PrismaValidationExceptionParser } from './PrismaValidationExceptionParser';
import { Prisma } from '@prisma/client';

describe('PrismaValidationExceptionParser', () => {
  let exception: Prisma.PrismaClientValidationError;
  let parser: PrismaValidationExceptionParser;

  describe('when exception message is empty', () => {
    beforeEach(() => {
      exception = new Prisma.PrismaClientValidationError('');
      parser = new PrismaValidationExceptionParser(exception);
    });

    it('will return empty object', () => {
      expect(parser.parse()).toEqual({});
    });
  });

  describe('when provided message matches format', () => {
    it('will parse string with single error', () => {
      const errorReason = `some-error`;
      const signleExceptionMessage = `Argument paramName: Got ${errorReason} on prisma`;
      exception = new Prisma.PrismaClientValidationError(signleExceptionMessage);
      parser = new PrismaValidationExceptionParser(exception);

      expect(parser.parse()).toEqual({ paramName: errorReason });
    });

    it('will parse string with multiple errors', () => {
      const reasonOne = 'reasonOne';
      const reasonTwo = 'reasonTwo';

      const exceptionMessage = `Argument paramOne: Got ${reasonOne} on prisma.Argument paramTwo: Got ${reasonTwo} on prisma`;
      exception = new Prisma.PrismaClientValidationError(exceptionMessage);
      parser = new PrismaValidationExceptionParser(exception);

      expect(parser.parse()).toEqual({ paramOne: reasonOne, paramTwo: reasonTwo });
    });

    it('will parse rich string with multiple errors between lines', () => {
      const reasonOne = 'reasonOne';
      const reasonTwo = 'reasonTwo';

      const exceptionMessage = `Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
      Argument paramOne: Got ${reasonOne} on prisma.
      when an unknown printer took a galley of type and scrambled
      Argument paramTwo: Got ${reasonTwo} on prisma
      it to make a type specimen book. It has survived not only five centuries,`;

      exception = new Prisma.PrismaClientValidationError(exceptionMessage);
      parser = new PrismaValidationExceptionParser(exception);

      expect(parser.parse()).toEqual({ paramOne: reasonOne, paramTwo: reasonTwo });
    });
  });
});

import { PrismaValidationExceptionParseResult } from './types';
import { Prisma } from '@prisma/client';

/**
 * PrismaValidationExceptionParser
 * @constructor
 * @param {Prisma.PrismaClientValidationError} exception - Prisma validation exception
 * @description Parsing exception for errors and convert them to JSON format
 * Excluding referernces to prisma and application internals
 * @method parse @returns {PrismaValidationExceptionParseResult} record of entries where key is paramName and its value errorReason
 */

export class PrismaValidationExceptionParser {
  // Looking for matches in following string format: Argument {{paramName}}: Got {{errorReason}} on prisma
  private pattern = new RegExp(/Argument ([^:]+):[^]+?Got ([^]+?) on prisma/, 'g');

  constructor(private readonly exception: Prisma.PrismaClientValidationError) {}

  parse(): PrismaValidationExceptionParseResult {
    const { message } = this.exception;
    const parseResult: PrismaValidationExceptionParseResult = {};

    let match: RegExpExecArray | null = null;

    if (!message) return {};

    while ((match = this.pattern.exec(message))) {
      const [_, paramName, errorReason] = match;

      if (paramName && errorReason) {
        parseResult[paramName] = errorReason;
      }
    }

    return parseResult;
  }
}

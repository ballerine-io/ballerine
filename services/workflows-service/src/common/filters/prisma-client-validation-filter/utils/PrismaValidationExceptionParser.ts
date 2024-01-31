import { PrismaValidationExceptionParseResult } from './types';
import { Prisma } from '@prisma/client';
import { IParser } from '@/common/filters/prisma-client-validation-filter/utils/parsers/parser/IParser';
import { removeAnsiEscapeCodes } from './remove-ansi-escape-codes';

/**
 * PrismaValidationExceptionParser
 * @constructor
 * @param {Prisma.PrismaClientValidationError} exception - Prisma validation exception
 * @description Parsing exception for errors and convert them to JSON format
 * Excluding referernces to prisma and application internals
 * @method parse @returns {PrismaValidationExceptionParseResult} record of entries where key is paramName and its value errorReason
 */

export class PrismaValidationExceptionParser {
  constructor(
    private readonly parsers: Array<new (message: string) => IParser>,
    private readonly exception: Prisma.PrismaClientValidationError,
  ) {}

  parse(): PrismaValidationExceptionParseResult {
    const { message } = this.exception;
    const parseResult: PrismaValidationExceptionParseResult = this.parsers.reduce(
      (parseResult, Parser) => {
        const parser = new Parser(removeAnsiEscapeCodes(message));

        return {
          ...parseResult,
          ...parser.parse(),
        };
      },
      {},
    );

    return parseResult;
  }
}

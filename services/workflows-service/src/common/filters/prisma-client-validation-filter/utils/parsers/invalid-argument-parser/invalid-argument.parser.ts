import {
  IParser,
  IParserResult,
} from '@/common/filters/prisma-client-validation-filter/utils/parsers/parser/IParser';

export class InvalidArgumentParser extends IParser {
  // Looking for matches in following string format: Argument {{paramName}}: Got {{errorReason}} on prisma
  // private pattern = new RegExp(/Argument ([^:]+):[^]+?Got ([^]+?) on prisma/, 'g');

  pattern = new RegExp(/Argument ([^:]+):[^]+?Got ([^]+?) on prisma/, 'g');

  parse(): IParserResult {
    const { message } = this;

    if (!message) return {};

    return this.execPattern(this.pattern, (result, match) => {
      const [_, paramName, errorReason] = match;

      if (paramName && errorReason) {
        result[paramName] = errorReason;
      }

      return result;
    });
  }
}

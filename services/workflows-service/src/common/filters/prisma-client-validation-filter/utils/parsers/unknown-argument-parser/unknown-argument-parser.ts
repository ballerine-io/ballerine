import {
  IParser,
  IParserResult,
} from '@/common/filters/prisma-client-validation-filter/utils/parsers/parser/IParser';

export class UnknownArgumentParser extends IParser {
  // Looking for matches in following string format: Unknown arg {{paramName}} in {{failedOnPath}} for type {{EntityType}}.
  pattern = new RegExp(/Unknown arg `(.+?)` in (.+?) for type (.+?)\./, 'gi');

  parse(): IParserResult {
    if (!this.message) return {};

    return this.execPattern(this.pattern, (result, match) => {
      const [_, fieldName, failedOnPath, type] = match;

      if (fieldName && failedOnPath && type) {
        result[fieldName] = this.buildMessage(fieldName, failedOnPath, type);
      }

      return result;
    });
  }

  buildMessage = (paramName: string, path: string, type: string) => {
    return `Provided parameter: ${paramName} on ${path} is not supported in type: ${type}`;
  };
}

export type IParserResult = Record<string, string>;
export type IParserResolver = (result: IParserResult, execResult: RegExpExecArray) => IParserResult;
export abstract class IParser {
  constructor(readonly message: string) {}

  abstract parse(): IParserResult;

  execPattern(pattern: RegExp, resolver: IParserResolver) {
    const { message } = this;
    let parseResult: IParserResult = {};

    let match: RegExpExecArray | null = null;

    if (!message) return {};

    while ((match = pattern.exec(message))) {
      parseResult = resolver(parseResult, match);
    }

    return parseResult;
  }
}

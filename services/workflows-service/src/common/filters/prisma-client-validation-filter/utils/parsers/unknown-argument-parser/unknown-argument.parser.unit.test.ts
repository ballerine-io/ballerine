import { UnknownArgumentParser } from './unknown-argument-parser';

describe('UnknownArgumentParser', () => {
  let parser: UnknownArgumentParser;

  describe('when exception message is empty', () => {
    beforeEach(() => {
      parser = new UnknownArgumentParser('');
    });

    it('will return empty object', () => {
      expect(parser.parse()).toEqual({});
    });
  });

  describe('when provided message matches format', () => {
    it('will parse string with single error', () => {
      const argumentName = 'someParam';
      const failedAtPath = `data.${argumentName}`;
      const type = 'SomeEntityDefinition';
      const signleExceptionMessage = `Unknown arg \`${argumentName}\` in ${failedAtPath} for type ${type}.`;
      parser = new UnknownArgumentParser(signleExceptionMessage);

      expect(parser.parse()).toEqual({
        [argumentName]: parser.buildMessage(argumentName, failedAtPath, type),
      });
    });

    describe('when working with multiple errors in message', () => {
      let errorParams: Array<{ argumentName: string; failedAtPath: string; type: string }>;
      let expectResult: Record<string, string>;

      beforeAll(() => {
        errorParams = [
          { argumentName: 'arg1', failedAtPath: 'some.where1', type: 'Entity1' },
          { argumentName: 'arg2', failedAtPath: 'some.where2', type: 'Entity2' },
        ];
        expectResult = errorParams.reduce((result, params) => {
          result[params.argumentName] = parser.buildMessage(
            params.argumentName,
            params.failedAtPath,
            params.type,
          );

          return result;
        }, {} as Record<string, string>);
      });

      it('will parse string with multiple errors', () => {
        const message = errorParams
          .map(
            params =>
              `Unknown arg \`${params.argumentName}\` in ${params.failedAtPath} for type ${params.type}.`,
          )
          .join('.');

        parser = new UnknownArgumentParser(message);

        expect(parser.parse()).toEqual(expectResult);
      });

      it('will parse rich string with multiple errors between lines', () => {
        const error1Params = errorParams[0];
        const error2Params = errorParams[1];

        const message = `Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
        Unknown arg \`${error1Params!.argumentName}\` in ${error1Params!.failedAtPath} for type ${
          error1Params!.type
        }.
        when an unknown printer took a galley of type and scrambled
        Unknown arg \`${error2Params!.argumentName}\` in ${error2Params!.failedAtPath} for type ${
          error2Params!.type
        }.
        it to make a type specimen book. It has survived not only five centuries,`;

        parser = new UnknownArgumentParser(message);

        expect(parser.parse()).toEqual(expectResult);
      });
    });
  });
});

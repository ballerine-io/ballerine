import { JsonSchemaRuleEngine } from '@/components/organisms/DynamicUI/rule-engines/json-schema.rule-engine';
import { ErrorField } from '@/components/organisms/DynamicUI/rule-engines/rule-engine.abstract';
import { Rule, UIElement } from '@/domains/collection-flow';

describe('JsonSchemaRuleEngine', () => {
  let ruleEngine: JsonSchemaRuleEngine;

  beforeEach(() => {
    ruleEngine = new JsonSchemaRuleEngine();
  });

  describe('.test', () => {
    it('will return true when test succeded', () => {
      const rule: Rule = {
        type: JsonSchemaRuleEngine.ENGINE_NAME,
        value: {
          type: 'string',
        },
      };

      expect(ruleEngine.test('', rule)).toEqual(true);
    });

    it('will return false when test fails', () => {
      const rule: Rule = {
        type: JsonSchemaRuleEngine.ENGINE_NAME,
        value: {
          type: 'string',
        },
      };

      expect(ruleEngine.test(null, rule)).toEqual(false);
    });

    it('will throw with unsupported format in schema', () => {
      const rule: Rule = {
        type: JsonSchemaRuleEngine.ENGINE_NAME,
        value: {
          type: 'string',
          format: 'duration',
        },
      };

      expect(() => ruleEngine.test('', rule)).toThrow();
    });
  });

  describe('.validate', () => {
    describe('with validation errors', () => {
      it('will return single validation error', () => {
        const rule: Rule = {
          type: JsonSchemaRuleEngine.ENGINE_NAME,
          value: {
            type: 'object',
            properties: {
              foo: {
                type: 'number',
              },
            },
          },
        };

        const testData = {
          foo: 'bar',
        };

        const testResult = ruleEngine.validate(testData, rule, {
          valueDestination: 'foo',
        } as UIElement);

        const expectedError: ErrorField = {
          type: 'error',
          fieldId: 'foo',
          fieldDestination: 'foo',
          message: expect.any(String) as string,
          definitionName: undefined,
        };

        expect(testResult.isValid).toBe(false);
        expect(testResult.errors?.length).toBe(1);
        expect(testResult.errors).toContainEqual(expectedError);
      });

      it('will return multiple validation errors', () => {
        const rule: Rule = {
          type: JsonSchemaRuleEngine.ENGINE_NAME,
          value: {
            type: 'object',
            properties: {
              foo: {
                type: 'number',
              },
              bar: {
                type: 'array',
              },
            },
          },
        };

        const fooError: ErrorField = {
          type: 'error',
          fieldId: 'foo',
          fieldDestination: undefined,
          message: expect.any(String) as string,
          definitionName: undefined,
        };

        const barError = {
          type: 'error',
          fieldId: 'bar',
          fieldDestination: undefined,
          message: expect.any(String) as string,
          definitionName: undefined,
        };

        const testData = {
          foo: 'bar',
          bar: null,
        };

        const testResult = ruleEngine.validate(testData, rule, {} as UIElement);

        expect(testResult.isValid).toBe(false);
        expect(testResult.errors?.length).toBe(2);
        expect(testResult.errors).toContainEqual(barError);
        expect(testResult.errors).toContainEqual(fooError);
      });
    });

    describe('fileId generation for nested schemas', () => {
      describe('plain objects', () => {
        it('will build fileId for nested property in schema', () => {
          const ruleSchema = {
            type: 'object',
            required: ['foo'],
            properties: {
              foo: {
                type: 'object',
                required: ['bar'],
                default: {},
                properties: {
                  bar: {
                    type: 'object',
                    required: ['baz'],
                    default: {},
                    properties: {
                      baz: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          };

          const rule: Rule = {
            type: JsonSchemaRuleEngine.ENGINE_NAME,
            value: ruleSchema,
          };

          const testData = {};
          const testError: ErrorField = {
            type: 'error',
            fieldId: 'foo.bar.baz',
            fieldDestination: undefined,
            definitionName: undefined,
            message: expect.any(String) as string,
          };

          const testResult = ruleEngine.validate(testData, rule, {} as UIElement);

          expect(testResult.errors?.length).toBe(1);
          expect(testResult.errors).toContainEqual(testError);
        });
      });

      describe('arrays', () => {
        describe('simple values', () => {
          describe.each([
            {
              testData: ['foo', 'bar', null],
              expected: '2',
            },
            {
              testData: [null, 'foo', 'bar'],
              expected: '0',
            },
            {
              testData: ['foo', null, 'bar'],
              expected: '1',
            },
          ])('fileId will be equal to expected value indexes', ({ testData, expected }) => {
            test('correctly builds fileId: $expected', () => {
              const rule: Rule = {
                type: JsonSchemaRuleEngine.ENGINE_NAME,
                value: {
                  type: 'array',
                  items: {
                    type: 'string',
                  },
                },
              };

              const testResult = ruleEngine.validate(testData, rule, {} as UIElement);

              expect(testResult.isValid).toBe(false);
              expect(testResult.errors?.length).toBe(1);
              expect(testResult.errors?.[0]?.fieldId).toBe(expected);
            });
          });
        });

        describe('nested values', () => {
          it('will build fileId for invalid property within array', () => {
            const rule: Rule = {
              type: JsonSchemaRuleEngine.ENGINE_NAME,
              value: {
                type: 'object',
                required: ['fooList'],
                properties: {
                  fooList: {
                    type: 'array',
                    default: [],
                    items: {
                      type: 'object',
                      required: ['foo'],
                      default: {},
                      properties: {
                        foo: {
                          type: 'string',
                        },
                      },
                    },
                  },
                },
              },
            };

            const testData = {
              fooList: [
                {
                  foo: null,
                },
              ],
            };
            const expectedFileId = 'fooList[0].foo';

            const testResult = ruleEngine.validate(testData, rule, {} as UIElement);

            expect(testResult.isValid).toBe(false);
            expect(testResult.errors?.length).toBe(1);
            expect(testResult.errors?.[0]?.fieldId).toBe(expectedFileId);
          });

          it('will build path to empty array', () => {
            const rule: Rule = {
              type: 'json-schema',
              value: {
                type: 'object',
                required: ['foo'],
                properties: {
                  foo: {
                    type: 'object',
                    required: ['list'],
                    default: {},
                    properties: {
                      list: {
                        type: 'array',
                        minItems: 1,
                        default: [],
                        items: {
                          type: 'string',
                        },
                      },
                    },
                  },
                },
              },
            };

            const testData = {};

            const testResult = ruleEngine.validate(testData, rule, {} as UIElement);

            expect(testResult.isValid).toBe(false);
            expect(testResult.errors?.length).toBe(1);
            expect(testResult.errors?.[0]?.fieldId).toBe('foo.list');
          });
        });
      });
    });
  });
});

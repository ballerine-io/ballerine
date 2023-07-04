import { BaseContextTransformer, THelperFormatingLogic } from './types';
import { TContext } from '../types';

export type THelperMethod = 'regex';
export class HelpersTransformer extends BaseContextTransformer {
  name = 'helpers-transformer';
  mapping: THelperFormatingLogic;

  constructor(mapping: THelperFormatingLogic) {
    super();
    this.mapping = mapping;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async transform(context: TContext, _options = {}) {
    this.mapping.map(mappingLogic => {
      const sourcePath = mappingLogic.source.split('.');
      const targetPath = mappingLogic.target.split('.');

      const sourceAttributeValue = this.getNestedProperty(context, sourcePath);
      // @ts-expect-error - source attribute value is dynamic - therefore it should match by config of tranformer
      const transformedValue = this[mappingLogic.method](sourceAttributeValue, mappingLogic.value);

      this.setNestedProperty(context, targetPath, transformedValue);
    });

    return context;
  }

  regex(attribute: string, value: string) {
    const result = attribute.match(new RegExp(value));

    return result ? result[0] : null;
  }

  getNestedProperty(record: Record<string, any>, path: Array<string>) {
    return path.reduce((prev, curr) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return prev ? prev[curr] : null;
    }, record);
  }

  setNestedProperty(obj: Record<string, any>, path: Array<string>, value: unknown) {
    let current = obj;
    for (let i = 0; i < path.length; i++) {
      if (i === path.length - 1) {
        current[path[i] as keyof typeof current] = value;
      } else {
        current[path[i] as keyof typeof current] =
          (current[path[i] as keyof typeof current] as unknown) || {};
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        current = current[path[i] as keyof typeof current];
      }
    }
  }
}

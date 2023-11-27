import { BaseContextTransformer, THelperFormatingLogic } from './types';
import { TContext } from '../types';

export type THelperMethod = 'regex' | 'imageUrlToBase64' | 'remove';
export class HelpersTransformer extends BaseContextTransformer {
  name = 'helpers-transformer';
  mapping: THelperFormatingLogic;

  constructor(mapping: THelperFormatingLogic) {
    super();
    this.mapping = mapping;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async transform(context: TContext, _options = {}) {
    for (const mappingLogic of this.mapping) {
      const sourcePath = mappingLogic.source.split('.');
      const targetPath = mappingLogic.target.split('.');

      const sourceAttributeValue = this.getNestedProperty(context, sourcePath);
      const transformedValue = await this[mappingLogic.method](
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore - sourceAttributeValue is dynamic and configurable
        sourceAttributeValue,
        mappingLogic.value,
      );
      this.setNestedProperty(context, targetPath, transformedValue);
    }

    return context;
  }

  remove() {
    return undefined;
  }

  regex(attribute: string, value: string) {
    const result = attribute.match(new RegExp(value));

    return result ? result[0] : null;
  }

  async imageUrlToBase64(url: string, _value: string) {
    const response = await fetch(url);
    const imageType = response?.headers?.get('Content-Type')?.split(';')?.[0] || 'image/png';
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const base64Image = buffer.toString('base64');
    const base64Prefix = `data:${imageType};base64,`;

    return base64Prefix + base64Image;
  }

  getNestedProperty(record: Record<string, any>, path: Array<string>) {
    return path.reduce((prev, curr) => {
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
        current = current[path[i] as keyof typeof current];
      }
    }
  }
}

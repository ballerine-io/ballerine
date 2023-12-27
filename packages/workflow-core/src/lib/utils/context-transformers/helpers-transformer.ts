import { BaseContextTransformer, THelperFormatingLogic } from './types';
import { TContext } from '../types';
import { search } from 'jmespath';
import { AnyRecord, uniqueArrayOfObjects } from '@ballerine/common';
import merge from 'lodash.merge';

export type THelperMethod =
  | 'regex'
  | 'imageUrlToBase64'
  | 'remove'
  | 'mergeArrayEachItemWithValue'
  | 'uniqueArrayOfObjects';
export class HelpersTransformer extends BaseContextTransformer {
  name = 'helpers-transformer';
  mapping: THelperFormatingLogic;

  constructor(mapping: THelperFormatingLogic) {
    super();
    this.mapping = mapping;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async transform(context: TContext, options = {}) {
    for (const mappingLogic of this.mapping) {
      const sourcePath = mappingLogic.source.split('.');
      const targetPath = mappingLogic.target.split('.');

      const sourceAttributeValue = this.getNestedProperty(context, sourcePath);
      const instanceMethodToInvoke = this[mappingLogic.method];
      const transformedValue = await instanceMethodToInvoke(
        context,
        sourceAttributeValue,
        mappingLogic.value,
        mappingLogic.options || options,
      );
      this.setNestedProperty(context, targetPath, transformedValue);
    }

    return context;
  }

  uniqueArrayOfObjects(
    context: Parameters<typeof this.transform>[0],
    attribute: Array<AnyRecord>,
    _value: string,
    options: { uniqueAttributes: Array<string> },
  ) {
    return uniqueArrayOfObjects(context, options.uniqueAttributes);
  }

  mergeArrayEachItemWithValue(
    context: Parameters<typeof this.transform>[0],
    attribute: Array<AnyRecord>,
    _value: string,
    options: { mapJmespath: string; mergeWithJmespath: string },
  ) {
    const jmespathResult = search(context, options.mapJmespath);
    const mergeWithResult = search(context, options.mergeWithJmespath);
    if (!jmespathResult || !mergeWithResult) {
      console.warn(
        'mergeArrayEachItemWithValue: jmespathResult or mergeWithResult is null',
        options.mergeWithJmespath,
        options.mapJmespath,
      );

      return attribute;
    }

    if (jmespathResult.length == 0) {
      console.log('jmespathResult: is 0', options.mapJmespath);

      return attribute;
    }

    return jmespathResult.map((item: AnyRecord) => merge(item, mergeWithResult));
  }

  remove(..._args: Array<any>) {
    return undefined;
  }

  regex(
    _context: Parameters<typeof this.transform>[0],
    attribute: string,
    value: string,
    _options: unknown,
  ) {
    const result = attribute.match(new RegExp(value));

    return result ? result[0] : null;
  }

  async imageUrlToBase64(
    _context: Parameters<typeof this.transform>[0],
    url: string,
    _value: string,
    _options: unknown,
  ) {
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

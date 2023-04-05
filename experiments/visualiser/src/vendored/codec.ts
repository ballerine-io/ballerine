interface InternalCodec<T> {
  __decode: Codec<T>['decode'];
  __encode: Codec<T>['encode'];
}

interface Codec<T> {
  /**
   * this tries to match **parsed** value to the expected type
   */
  decode: (val: unknown) => T;
  /**
   * as encoded values are coming from the app we can trust our types
   * this is used mainly to purify the value, pick only required keys and so on
   */
  encode: (val: T) => T;
}

function identity<T>(a: T): T {
  return a;
}

export function createCodec<T>() {
  return (codec: InternalCodec<T>): Codec<T> => ({
    decode: codec.__decode,
    encode: codec.__encode,
  });
}

type UnknownShape = Record<string, InternalCodec<any>>;

type ShapeToObj<T extends UnknownShape> = {
  [K in keyof T]: ReturnType<T[K]['__decode']>;
};

export function str(): InternalCodec<string> {
  return {
    __decode: (val: unknown) => {
      if (typeof val !== 'string') {
        throw new Error('Expected a string');
      }
      return val;
    },
    __encode: identity,
  };
}

export function num(): InternalCodec<number> {
  return {
    __decode: (val: unknown) => {
      if (typeof val !== 'number') {
        throw new Error('Expected a number');
      }
      return val;
    },
    __encode: identity,
  };
}

export function obj<S extends UnknownShape>(
  shape: S,
): InternalCodec<ShapeToObj<S>> {
  return {
    __decode: (val: unknown) => {
      if (typeof val !== 'object') {
        throw new Error(`Input value is not an object.`);
      }
      if (val === null) {
        throw new Error(`Input value is \`null\`.`);
      }

      const decoded: any = {};

      for (const key of Object.keys(shape)) {
        if (!(key in val)) {
          throw new Error(
            `Key "${key}" is missing in the expected shape of \`{${Object.keys(
              shape,
            ).join(', ')}}\``,
          );
        }
        decoded[key] = shape[key].__decode((val as any)[key]);
      }

      return decoded;
    },
    __encode: (val: ShapeToObj<S>): ShapeToObj<S> => {
      const encoded: any = {};

      for (const key of Object.keys(shape)) {
        encoded[key] = shape[key].__encode(val[key]);
      }

      return encoded;
    },
  };
}

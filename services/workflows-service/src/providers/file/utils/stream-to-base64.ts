import { Base64Encode } from 'base64-stream';
import concat from 'concat-stream';

export const streamToBase64 = (stream: NodeJS.ReadableStream): Promise<string> => {
  return new Promise((resolve, reject) => {
    const base64Encoder = new Base64Encode();

    stream
      .pipe(base64Encoder)
      .pipe(concat(base64 => resolve(base64 as unknown as string)))
      .on('error', reject);
  });
};

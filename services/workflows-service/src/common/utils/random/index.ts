const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const NUMBERS = '0123456789';
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

type Options = {
  includeSymbols?: boolean;
  includeNumbers?: boolean;
  includeAlphabetics?: boolean;
};

const defaultOptions: Options = {
  includeSymbols: false,
  includeNumbers: true,
  includeAlphabetics: true,
};

export const generateRandomId = (length: number, options?: Options) => {
  const { includeSymbols, includeNumbers, includeAlphabetics } = { ...defaultOptions, ...options };

  if (!includeSymbols && !includeNumbers && !includeAlphabetics) {
    throw new Error('At least one option should be enabled.');
  }

  let charSet = '';
  if (includeSymbols) charSet += SYMBOLS;
  if (includeNumbers) charSet += NUMBERS;
  if (includeAlphabetics) charSet += CHARS;

  let result = '';
  for (let i = 0; i < length; i++) {
    result += charSet.charAt(Math.floor(Math.random() * charSet.length));
  }

  return result;
};

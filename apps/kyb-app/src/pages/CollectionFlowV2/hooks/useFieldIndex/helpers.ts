const findLastDigit = (str: string) => {
  const digitRegex = /_(\d+)_/g;
  const matches = digitRegex.exec(str);

  if (matches && matches.length > 0) {
    // @ts-ignore
    const result = parseInt(matches[matches.length - 1]);
    return result;
  }

  return null;
};

export const parseInputIndex = (inputId: string) => findLastDigit(inputId);

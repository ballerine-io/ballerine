/**
 * Used as a string template literals tag to return a string without nullish
 * values, replacing two or more spaces with a single space.
 * @param template
 * @param args
 */
export const noNullish = <TArgs extends Array<unknown>>(
  template: TemplateStringsArray,
  ...args: TArgs
) =>
  template
    .reduce((acc, curr, i) => {
      const arg = args[i] ?? '';

      return acc + curr + String(arg);
    }, '')
    .replace(/\s+/g, ' ');

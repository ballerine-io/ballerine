export const booleanToYesOrNo = (value: boolean | null | undefined) => {
  if (typeof value !== 'boolean') {
    return value;
  }

  return value ? 'Yes' : 'No';
};

export const formatValueDestinationAndApplyStackIndexes = (
  valueDestination: string,
  stack: number[],
) => {
  stack.forEach((stackValue, index) => {
    valueDestination = valueDestination.replace(`$${index}`, String(stackValue));
  });

  return valueDestination;
};

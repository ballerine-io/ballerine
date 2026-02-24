import { faker } from '@faker-js/faker';

export const generateUserNationalId = () => {
  // Generate a random 9-digit number
  const nineDigitNumber = faker.string.numeric(9);

  // Generate a random single digit number
  const singleDigitNumber = faker.string.numeric(1);

  // Combine them according to the pattern
  return `GHA-${nineDigitNumber}-${singleDigitNumber}`;
};

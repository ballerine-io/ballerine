import { faker } from '@faker-js/faker';

export const generateUserNationalId = () => {
  // Generate a random 9-digit number
  const nineDigitNumber = faker.random.numeric(9);

  // Generate a random single digit number
  const singleDigitNumber = faker.random.numeric(1);

  // Combine them according to the pattern
  return `GHA-${nineDigitNumber}-${singleDigitNumber}`;
};

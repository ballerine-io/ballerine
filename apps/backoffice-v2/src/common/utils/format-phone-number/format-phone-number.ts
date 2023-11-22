export const formatPhoneNumber = (phoneNumber: string) => {
  const dialCode = phoneNumber?.slice(0, 3);
  const number = phoneNumber?.slice(3);

  return `+${dialCode} ${number}`;
};

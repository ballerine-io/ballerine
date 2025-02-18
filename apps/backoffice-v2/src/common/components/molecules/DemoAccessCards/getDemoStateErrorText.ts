import { isNumber } from 'lodash-es';

export const getDemoStateErrorText = ({
  reportsLeft,
  demoDaysLeft,
}: {
  reportsLeft: number | null | undefined;
  demoDaysLeft: number | null | undefined;
}) => {
  if (isNumber(demoDaysLeft) && demoDaysLeft <= 0) {
    return 'Your trial period has expired.';
  }

  if (isNumber(reportsLeft) && reportsLeft <= 0) {
    return 'You have used all of your Web Presence reports credits.';
  }

  return null;
};

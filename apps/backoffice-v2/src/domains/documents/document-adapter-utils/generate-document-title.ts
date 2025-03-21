import { valueOrNA } from '@ballerine/common';

import { titleCase } from 'string-ts';

export const generateDocumentTitle = ({
  category,
  type,
  variant,
}: {
  category: string;
  type: string;
  variant: string;
}) => {
  return [valueOrNA(titleCase(category ?? '')), valueOrNA(titleCase(type ?? '')), variant].join(
    ' - ',
  );
};

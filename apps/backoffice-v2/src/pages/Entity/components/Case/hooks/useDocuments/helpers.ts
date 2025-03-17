import { isCsv } from '@/common/utils/is-csv/is-csv';
import { convertCsvToPdfBase64String } from '../../../../../../common/utils/convert-csv-to-pdf-base64-string/convert-csv-to-pdf-base64-string';
import { IDocumentsProps } from '../../interfaces';

export const convertCsvDocumentsToPdf = (documents: IDocumentsProps['documents']) => {
  return documents?.map(document => {
    if (isCsv(document)) {
      return { ...document, imageUrl: convertCsvToPdfBase64String(document.imageUrl) };
    }

    return document;
  });
};

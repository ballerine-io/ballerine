import { isCsv } from '@/common/utils/is-csv/is-csv';
import { convertCsvToPdfBase64String } from '../../../../../../common/utils/convert-csv-to-pdf-base64-string/convert-csv-to-pdf-base64-string';
import { IDocumentsProps } from '../../interfaces';
import { isBase64 } from '@/common/utils/is-base64/is-base64';

export const convertCsvDocumentsToPdf = (documents: IDocumentsProps['documents']) => {
  return documents?.map(document => {
    if (isCsv(document) && isBase64(document.base64 || '')) {
      return { ...document, imageUrl: convertCsvToPdfBase64String(document.base64) };
    }

    return document;
  });
};

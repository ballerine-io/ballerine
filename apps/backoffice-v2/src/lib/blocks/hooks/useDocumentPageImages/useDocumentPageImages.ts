import { AnyObject } from '@ballerine/ui';
import { UseQueryResult } from '@tanstack/react-query';
import { useMemo } from 'react';

export type DocumentPageImagesResult = string[][];

export const useDocumentPageImages = (
  documents: AnyObject[],
  files: UseQueryResult[],
): DocumentPageImagesResult => {
  const results = useMemo(() => {
    const filesCopy = [...files];

    const result = documents.reduce((list: DocumentPageImagesResult, document, documentIndex) => {
      (document?.pages as AnyObject[])?.forEach((_, pageIndex: number) => {
        if (!list[documentIndex]) {
          list[documentIndex] = [];
        }
        list[documentIndex][pageIndex] = filesCopy?.shift()?.data as string;
      });

      return list;
    }, []) as DocumentPageImagesResult;

    return result;
  }, [documents, files]);

  return results;
};

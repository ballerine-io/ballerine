import { TWorkflowById } from '@/domains/workflows/fetchers';
import { TDocument } from '@ballerine/common';
import { useMemo } from 'react';
import { useBusinessDocuments } from '../../../useBusinessDocuments';
import { useDirectorsDocuments } from '../../../useDirectorsDocuments';
import { useUbosDocuments } from '../../../useUbosDocuments';
import { getDirectorEntityFromWorkflow } from './helpers/get-director-entity-from-workflow';
import { getUboEntityFromWorkflow } from './helpers/get-ubo-entity-from-workflow';
import { IDocumentEntity } from './types';

export type TDocumentWithEntityTypeAndEntity = TDocument & {
  entityType: 'business' | 'director' | 'ubo';
  entity: IDocumentEntity;
};

export const useDocuments = (workflow: TWorkflowById) => {
  const [
    {
      documents: businessDocuments,
      documentsSchemas: businessDocumentsSchemas,
      isLoading: isLoadingBusinessDocuments,
    },
    {
      documents: directorsDocuments,
      documentsSchemas: directorsDocumentsSchemas,
      isLoading: isLoadingDirectorsDocuments,
    },
    {
      documents: ubosDocuments,
      documentsSchemas: ubosDocumentsSchemas,
      isLoading: isLoadingUbosDocuments,
    },
  ] = [
    useBusinessDocuments(workflow as TWorkflowById),
    useDirectorsDocuments(workflow as TWorkflowById),
    useUbosDocuments(workflow as TWorkflowById),
  ];

  const documents = useMemo(
    () =>
      [
        ...businessDocuments,
        ...directorsDocuments.map(document => ({
          ...document,
          entityType: 'director',
          entity: getDirectorEntityFromWorkflow(workflow, document),
        })),
        ...ubosDocuments.map(document => ({
          ...document,
          entity: getUboEntityFromWorkflow(workflow, document),
          entityType: 'ubo',
        })),
      ] as TDocumentWithEntityTypeAndEntity[],
    [businessDocuments, directorsDocuments, ubosDocuments, workflow],
  );
  const documentsSchemas = useMemo(
    () => [
      ...(businessDocumentsSchemas || []),
      ...(directorsDocumentsSchemas || []),
      ...(ubosDocumentsSchemas || []),
    ],
    [businessDocumentsSchemas, directorsDocumentsSchemas, ubosDocumentsSchemas],
  );

  const isLoading = useMemo(
    () =>
      [isLoadingBusinessDocuments, isLoadingDirectorsDocuments, isLoadingUbosDocuments].some(
        Boolean,
      ),
    [isLoadingBusinessDocuments, isLoadingDirectorsDocuments, isLoadingUbosDocuments],
  );

  return {
    documents,
    businessDocuments,
    directorsDocuments,
    ubosDocuments,
    documentsSchemas,
    isLoading,
  };
};

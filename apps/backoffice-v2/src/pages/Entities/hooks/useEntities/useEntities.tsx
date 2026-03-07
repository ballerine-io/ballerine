import { useCaseCreationWorkflowDefinition } from '@/pages/Entities/components/CaseCreation/hooks/useCaseCreationWorkflowDefinition';
import { ChangeEventHandler, useCallback, useEffect, useMemo, useState } from 'react';
import { useEntityType } from '../../../../common/hooks/useEntityType/useEntityType';
import { useSearch } from '../../../../common/hooks/useSearch/useSearch';
import { useSearchParamsByEntity } from '../../../../common/hooks/useSearchParamsByEntity/useSearchParamsByEntity';
import { createArrayOfNumbers } from '../../../../common/utils/create-array-of-numbers/create-array-of-numbers';
import { useSelectEntityOnMount } from '../../../../domains/entities/hooks/useSelectEntityOnMount/useSelectEntityOnMount';
import { useWorkflowsQuery } from '../../../../domains/workflows/hooks/queries/useWorkflowsQuery/useWorkflowsQuery';
import { usePagination } from '@/common/hooks/usePagination/usePagination';
import { useBatchWorkflowEventDecisionMutation } from '@/domains/workflows/hooks/mutations/useBatchWorkflowEventDecisionMutation/useBatchWorkflowEventDecisionMutation';
import { toast } from 'sonner';

export const useEntities = () => {
  const { search, onSearch } = useSearch();
  const [{ filterId, filter, sortBy, sortDir, page, pageSize }, setSearchParams] =
    useSearchParamsByEntity();

  const { data, isLoading } = useWorkflowsQuery({
    filterId,
    filter,
    sortBy,
    sortDir,
    page,
    pageSize,
    search,
  });
  const cases = data?.data;
  const casesIds = useMemo(() => cases?.map(case_ => case_.id) ?? [], [cases]);
  const totalPages = data?.meta?.totalPages ?? 0;
  const entity = useEntityType();
  const [selectedCaseIds, setSelectedCaseIds] = useState<string[]>([]);
  const { mutateAsync: mutateBatchDecision, isLoading: isLoadingBulkDecision } =
    useBatchWorkflowEventDecisionMutation();

  useEffect(() => {
    setSelectedCaseIds(previousSelectedCaseIds =>
      previousSelectedCaseIds.filter(caseId => casesIds.includes(caseId)),
    );
  }, [casesIds]);

  const onSortDirToggle = useCallback(() => {
    setSearchParams({
      sortDir: sortDir === 'asc' ? 'desc' : 'asc',
    });
  }, [setSearchParams, sortDir]);

  const onSortBy = useCallback(
    (sortBy: string) => {
      setSearchParams({
        sortBy,
      });
    },
    [setSearchParams],
  );

  const onFilterChange = useCallback(
    (key: string) => {
      return (values: string[]) => {
        setSearchParams({
          filter: {
            ...filter,
            [key]: values,
          },
          page: 1,
        });
      };
    },
    [filter, setSearchParams],
  );

  const { onPaginate, onPrevPage, onNextPage, onLastPage, isLastPage } = usePagination({
    totalPages: data?.meta?.totalPages ?? 0,
  });

  const onSearchChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    event => {
      onSearch(event.target.value);
    },
    [onSearch],
  );
  const onSortByChange: ChangeEventHandler<HTMLSelectElement> = useCallback(
    event => {
      onSortBy(event.target.value);
    },
    [onSortBy],
  );
  const skeletonEntities = createArrayOfNumbers(3);

  const onToggleSelectCase = useCallback((caseId: string) => {
    setSelectedCaseIds(previousSelectedCaseIds =>
      previousSelectedCaseIds.includes(caseId)
        ? previousSelectedCaseIds.filter(selectedCaseId => selectedCaseId !== caseId)
        : [...previousSelectedCaseIds, caseId],
    );
  }, []);

  const isAllCasesOnCurrentPageSelected = useMemo(
    () => casesIds.length > 0 && casesIds.every(caseId => selectedCaseIds.includes(caseId)),
    [casesIds, selectedCaseIds],
  );

  const onToggleSelectAllCasesOnCurrentPage = useCallback(() => {
    setSelectedCaseIds(previousSelectedCaseIds => {
      if (isAllCasesOnCurrentPageSelected) {
        return previousSelectedCaseIds.filter(caseId => !casesIds.includes(caseId));
      }

      return [...new Set([...previousSelectedCaseIds, ...casesIds])];
    });
  }, [casesIds, isAllCasesOnCurrentPageSelected]);

  const onClearSelectedCases = useCallback(() => {
    setSelectedCaseIds([]);
  }, []);

  // Bulk action confirmation dialog state
  const [bulkActionDialog, setBulkActionDialog] = useState<{
    isOpen: boolean;
    action: 'approve' | 'reject' | 'revision' | null;
  }>({ isOpen: false, action: null });

  const actionNameByDecisionName = {
    approve: 'approved',
    reject: 'rejected',
    revision: 'sent for re-upload',
  } as const;

  const actionPromptByDecisionName = {
    approve: 'Approve',
    reject: 'Reject',
    revision: 'Send for re-upload',
  } as const;

  const onRequestBulkDecision = useCallback(
    (name: 'approve' | 'reject' | 'revision') => {
      if (!selectedCaseIds.length) {
        return;
      }

      setBulkActionDialog({ isOpen: true, action: name });
    },
    [selectedCaseIds.length],
  );

  const onCloseBulkActionDialog = useCallback(() => {
    setBulkActionDialog({ isOpen: false, action: null });
  }, []);

  const executeBulkDecision = useCallback(
    async (name: 'approve' | 'reject' | 'revision') => {
      setBulkActionDialog({ isOpen: false, action: null });

      try {
        const chunkSize = 100;
        const workflowIdChunks: string[][] = [];

        for (let index = 0; index < selectedCaseIds.length; index += chunkSize) {
          workflowIdChunks.push(selectedCaseIds.slice(index, index + chunkSize));
        }

        const aggregatedResult = {
          succeeded: 0,
          failed: 0,
          results: [] as Array<{ id: string; success: boolean; error?: string }>,
        };

        for (const workflowIds of workflowIdChunks) {
          let chunkResult = null;
          let retries = 0;
          const maxRetries = 2;

          while (retries <= maxRetries) {
            try {
              chunkResult = await mutateBatchDecision({
                workflowIds,
                name,
              });

              break;
            } catch (retryError) {
              retries++;

              if (retries > maxRetries) {
                throw retryError;
              }

              // Exponential backoff: 1s, 2s
              await new Promise(resolve => setTimeout(resolve, 1000 * retries));
            }
          }

          if (!chunkResult) {
            throw new Error('Chunk batch decision failed');
          }

          aggregatedResult.succeeded += chunkResult.succeeded;
          aggregatedResult.failed += chunkResult.failed;
          aggregatedResult.results.push(...chunkResult.results);
        }

        const failedWorkflowIds = aggregatedResult.results
          .filter(decisionResult => !decisionResult.success)
          .map(decisionResult => decisionResult.id);

        setSelectedCaseIds(failedWorkflowIds);

        if (aggregatedResult.failed > 0) {
          toast.warning(
            `Batch action completed: ${aggregatedResult.succeeded} succeeded, ${aggregatedResult.failed} failed.`,
          );

          return;
        }

        toast.success(
          `${aggregatedResult.succeeded} case${aggregatedResult.succeeded === 1 ? '' : 's'} ${
            actionNameByDecisionName[name]
          }.`,
        );
      } catch (error) {
        console.error('Bulk action failed:', error);
        toast.error('Batch action failed. Please try again.');
      }
    },
    [mutateBatchDecision, selectedCaseIds],
  );

  const onConfirmBulkAction = useCallback(() => {
    if (bulkActionDialog.action) {
      executeBulkDecision(bulkActionDialog.action);
    }
  }, [bulkActionDialog.action, executeBulkDecision]);

  useSelectEntityOnMount();

  const { workflowDefinition } = useCaseCreationWorkflowDefinition();

  const isNoCases = !isLoading && Array.isArray(cases) && !cases.length;

  return {
    onPaginate,
    onPrevPage,
    onNextPage,
    onLastPage,
    isLastPage,
    onSearch: onSearchChange,
    onFilter: onFilterChange,
    onSortBy: onSortByChange,
    onSortDirToggle,
    search,
    cases,
    caseCount: data?.meta?.totalItems || 0,
    isLoading,
    page,
    totalPages,
    skeletonEntities,
    entity,
    isManualCaseCreationEnabled: workflowDefinition?.config?.enableManualCreation,
    isNoCases,
    selectedCaseIds,
    selectedCasesCount: selectedCaseIds.length,
    isAllCasesOnCurrentPageSelected,
    onToggleSelectCase,
    onToggleSelectAllCasesOnCurrentPage,
    onClearSelectedCases,
    onBulkApproveCases: () => onRequestBulkDecision('approve'),
    onBulkRejectCases: () => onRequestBulkDecision('reject'),
    onBulkRevisionCases: () => onRequestBulkDecision('revision'),
    isLoadingBulkDecision,
    bulkActionDialog,
    onCloseBulkActionDialog,
    onConfirmBulkAction,
    actionPromptByDecisionName,
  };
};

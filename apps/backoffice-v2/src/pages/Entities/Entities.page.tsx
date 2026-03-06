import { CaseCreation } from '@/pages/Entities/components/CaseCreation';
import { TStateTags } from '@ballerine/common';
import { ctw, Skeleton } from '@ballerine/ui';
import React, { FunctionComponent } from 'react';
import { Outlet } from 'react-router-dom';
import { TAssignee } from '../../common/components/atoms/AssignDropdown/AssignDropdown';
import { MotionScrollArea } from '../../common/components/molecules/MotionScrollArea/MotionScrollArea';
import { Cases } from './components/Cases/Cases';
import { useEntities } from './hooks/useEntities/useEntities';
import { NoCases } from '@/pages/Entities/components/NoCases/NoCases';
import { UrlPagination } from '@/common/components/molecules/UrlPagination/UrlPagination';
import { Dialog } from '@/common/components/organisms/Dialog/Dialog';
import { DialogContent } from '@/common/components/organisms/Dialog/Dialog.Content';
import { DialogDescription } from '@/common/components/organisms/Dialog/Dialog.Description';
import { DialogFooter } from '@/common/components/organisms/Dialog/Dialog.Footer';
import { DialogHeader } from '@/common/components/organisms/Dialog/Dialog.Header';
import { DialogTitle } from '@/common/components/organisms/Dialog/Dialog.Title';
import { Button } from '@/common/components/atoms/Button/Button';

export const Entities: FunctionComponent = () => {
  const {
    onPaginate,
    onPrevPage,
    onNextPage,
    onLastPage,
    isLastPage,
    onSearch,
    onFilter,
    onSortBy,
    onSortDirToggle,
    search,
    cases,
    isLoading,
    page,
    totalPages,
    caseCount,
    skeletonEntities,
    isManualCaseCreationEnabled,
    isNoCases,
    selectedCaseIds,
    selectedCasesCount,
    isAllCasesOnCurrentPageSelected,
    onToggleSelectCase,
    onToggleSelectAllCasesOnCurrentPage,
    onClearSelectedCases,
    onBulkApproveCases,
    onBulkRejectCases,
    onBulkRevisionCases,
    isLoadingBulkDecision,
    bulkActionDialog,
    onCloseBulkActionDialog,
    onConfirmBulkAction,
    actionPromptByDecisionName,
  } = useEntities();

  return (
    <>
      <Cases
        onSearch={onSearch}
        onFilter={onFilter}
        onSortBy={onSortBy}
        onSortDirToggle={onSortDirToggle}
        search={search}
        count={caseCount}
        selectedCasesCount={selectedCasesCount}
        isAllCasesOnCurrentPageSelected={isAllCasesOnCurrentPageSelected}
        isLoadingBulkDecision={isLoadingBulkDecision}
        onToggleSelectAllCasesOnCurrentPage={onToggleSelectAllCasesOnCurrentPage}
        onClearSelectedCases={onClearSelectedCases}
        onBulkApproveCases={onBulkApproveCases}
        onBulkRejectCases={onBulkRejectCases}
        onBulkRevisionCases={onBulkRevisionCases}
      >
        <MotionScrollArea
          className={ctw({
            'h-[calc(100vh-300px)]': isManualCaseCreationEnabled,
            'h-[calc(100vh-240px)]': !isManualCaseCreationEnabled,
          })}
        >
          <Cases.List>
            {isLoading
              ? skeletonEntities.map(index => (
                  <Cases.SkeletonItem key={`cases-list-skeleton-${index}`} />
                ))
              : cases?.map(case_ => (
                  <Cases.Item
                    key={case_.id}
                    id={case_.id}
                    fullName={case_.entity.name}
                    createdAt={case_.createdAt}
                    assignee={
                      case_.assignee
                        ? ({
                            id: case_.assignee?.id,
                            fullName: `${case_.assignee?.firstName} ${case_.assignee?.lastName}`,
                            avatarUrl: case_.assignee?.avatarUrl,
                          } as TAssignee)
                        : null
                    }
                    tags={(case_.tags ?? []) as unknown as TStateTags}
                    entityAvatarUrl={case_.entity?.avatarUrl ?? ''}
                    isSelected={selectedCaseIds.includes(case_.id)}
                    onToggleSelect={onToggleSelectCase}
                  />
                ))}
          </Cases.List>
        </MotionScrollArea>
        <div className={`divider my-0 px-4`}></div>
        <div className="flex flex-col gap-5 px-4">
          <div className={`flex items-center gap-x-2`}>
            <div className={`d-full flex items-center text-sm`}>
              {!isLoading && `Page ${page} of ${totalPages || 1}`}
              {isLoading && <Skeleton className={`h-5 w-full`} />}
            </div>
            <UrlPagination
              page={page}
              onPrevPage={onPrevPage}
              onNextPage={onNextPage}
              onLastPage={onLastPage}
              onPaginate={onPaginate}
              isLastPage={isLastPage}
            />
          </div>
          {isManualCaseCreationEnabled && <CaseCreation />}
        </div>
      </Cases>
      {isNoCases && <NoCases />}
      {!isNoCases && <Outlet />}
      <Dialog
        open={bulkActionDialog.isOpen}
        onOpenChange={open => !open && onCloseBulkActionDialog()}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Bulk Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to{' '}
              {bulkActionDialog.action
                ? actionPromptByDecisionName[bulkActionDialog.action].toLowerCase()
                : ''}{' '}
              {selectedCasesCount} selected case{selectedCasesCount === 1 ? '' : 's'}? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={onCloseBulkActionDialog}>
              Cancel
            </Button>
            <Button
              variant={
                bulkActionDialog.action === 'reject'
                  ? 'destructive'
                  : bulkActionDialog.action === 'approve'
                  ? 'success'
                  : 'warning'
              }
              onClick={onConfirmBulkAction}
            >
              {bulkActionDialog.action ? actionPromptByDecisionName[bulkActionDialog.action] : ''}{' '}
              {selectedCasesCount} case{selectedCasesCount === 1 ? '' : 's'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

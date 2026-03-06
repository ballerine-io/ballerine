import { StateTag } from '@ballerine/common';
import { Badge } from '@ballerine/ui';
import { FunctionComponent, useCallback, useMemo } from 'react';

import { AssignDropdown } from '@/common/components/atoms/AssignDropdown/AssignDropdown';
import { Avatar } from '@/common/components/atoms/Avatar';
import { Button } from '@/common/components/atoms/Button/Button';
import { createInitials } from '@/common/utils/create-initials/create-initials';
import { ctw } from '@/common/utils/ctw/ctw';
import { stringToRGB } from '@/common/utils/string-to-rgb/string-to-rgb';
import { NotesButton } from '@/domains/notes/NotesButton';
import { NotesSheet } from '@/domains/notes/NotesSheet';
import { useWorkflowsQuery } from '@/domains/workflows/hooks/queries/useWorkflowsQuery/useWorkflowsQuery';
import { ActionsVariant } from '@/pages/Entity/components/Case/actions-variants/ActionsVariant/ActionsVariant';
import { CaseOptions } from '@/pages/Entity/components/Case/components/CaseOptions/CaseOptions';
import { tagToBadgeData } from './consts';
import { useCaseActionsLogic } from './hooks/useCaseActionsLogic/useCaseActionsLogic';
import { IActionsProps } from './interfaces';
import { CustomLabels } from '@/lib/blocks/components/CustomLabels/CustomLabels';
import { useSearchParamsByEntity } from '@/common/hooks/useSearchParamsByEntity/useSearchParamsByEntity';
import { useSearch } from '@/common/hooks/useSearch/useSearch';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * @description To be used by {@link Case}. Displays the entity's full name, avatar, and handles the reject/approve mutation.
 *
 * @param props
 * @param props.id - The id of the entity, passed into the reject/approve mutation.
 * @param props.entityId - The id of the selected entity to be used in the notes.
 * @param props.fullName - The full name of the entity.
 * @param props.showResolutionButtons - Whether to show the reject/approve buttons.
 *
 * @see {@link Case}
 *
 * @constructor
 */
export const Actions: FunctionComponent<IActionsProps> = ({
  id,
  entityId,
  fullName,
  showResolutionButtons,
}) => {
  const {
    tag,
    assignedUser,
    authenticatedUser,
    isLoadingCase,
    assignees,
    onMutateAssignWorkflow,
    workflowDefinition,
    isWorkflowCompleted,
    avatarUrl,
    notes,
    isNotesOpen,
    setIsNotesOpen,
    workflow,
    customLabels,
    onAddCustomLabel,
    onRemoveCustomLabel,
  } = useCaseActionsLogic({ workflowId: id, fullName });

  const entityInitials = createInitials(fullName);
  const rgb = useMemo(() => stringToRGB(fullName), [fullName]);

  // Prev/Next case navigation
  const { locale = 'en', entityId: currentEntityId } = useParams();
  const { search } = useSearch();
  const [{ filterId, filter, sortBy, sortDir, page, pageSize }] = useSearchParamsByEntity();
  const { data: workflowsData } = useWorkflowsQuery({
    filterId,
    filter,
    sortBy,
    sortDir,
    page,
    pageSize,
    search,
  });
  const navigate = useNavigate();
  const caseIds = useMemo(() => workflowsData?.data?.map(c => c.id) ?? [], [workflowsData]);
  const currentIndex = caseIds.indexOf(currentEntityId ?? '');
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < caseIds.length - 1;

  const onNavigatePrev = useCallback(() => {
    if (hasPrev) {
      navigate(
        `/${locale}/case-management/entities/${caseIds[currentIndex - 1]}${window.location.search}`,
      );
    }
  }, [hasPrev, navigate, locale, caseIds, currentIndex]);

  const onNavigateNext = useCallback(() => {
    if (hasNext) {
      navigate(
        `/${locale}/case-management/entities/${caseIds[currentIndex + 1]}${window.location.search}`,
      );
    }
  }, [hasNext, navigate, locale, caseIds, currentIndex]);

  return (
    <div className={`col-span-2 space-y-2 bg-base-100 px-4 pt-4`}>
      <div className={`mb-8 flex flex-row items-center justify-between space-x-3.5`}>
        <AssignDropdown
          assignedUser={assignedUser}
          assignees={assignees}
          onAssigneeSelect={id => {
            onMutateAssignWorkflow(id, id === authenticatedUser?.id);
          }}
          authenticatedUserId={authenticatedUser?.id}
          isDisabled={isWorkflowCompleted}
          excludedRoles={['viewer']}
        />
        <div className="flex items-center gap-1">
          {caseIds.length > 1 && (
            <div className="mr-2 flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={onNavigatePrev}
                disabled={!hasPrev}
                className="h-8 w-8 p-0"
                title="Previous case"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="min-w-[3rem] text-center text-xs text-muted-foreground">
                {currentIndex >= 0 ? currentIndex + 1 : '?'}/{caseIds.length}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={onNavigateNext}
                disabled={!hasNext}
                className="h-8 w-8 p-0"
                title="Next case"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
          <CaseOptions />
        </div>
      </div>
      <div className={`flex min-h-20 justify-between gap-4`}>
        <div className={`flex flex-col space-y-3`}>
          <div className={`flex space-x-4`}>
            <Avatar
              src={avatarUrl}
              className="text-base font-semibold d-8"
              alt={`${fullName}'s avatar`}
              placeholder={entityInitials}
              style={{
                color: `rgb(${rgb})`,
                backgroundColor: `rgba(${rgb}, 0.2)`,
              }}
            />
            <h2
              className={ctw(
                `flex w-full max-w-[35ch] items-center break-all text-2xl font-semibold leading-9`,
                {
                  'h-8 w-full max-w-[24ch] animate-pulse rounded-md bg-gray-200 theme-dark:bg-neutral-focus':
                    isLoadingCase,
                },
              )}
            >
              {fullName}
              {workflow?.config?.example === true && (
                <Badge className="ml-2 max-w-full truncate rounded-full bg-gray-100 px-1 py-0.5 text-xs text-gray-600">
                  Sample Data
                </Badge>
              )}
            </h2>
          </div>
          <div className={`flex items-center space-x-6`}>
            {tag && (
              <div className={`flex space-x-2`}>
                <span className={`me-2 text-sm leading-6`}>Status</span>
                <Badge
                  variant={tagToBadgeData[tag].variant}
                  className={ctw(`whitespace-nowrap text-sm font-bold`, {
                    'bg-info/20 text-info': tag === StateTag.MANUAL_REVIEW,
                    'bg-violet-500/20 text-violet-500': [
                      StateTag.COLLECTION_FLOW,
                      StateTag.DATA_ENRICHMENT,
                    ].includes(tag),
                  })}
                >
                  {tagToBadgeData[tag].text}
                </Badge>
              </div>
            )}
            <NotesSheet
              open={isNotesOpen}
              onOpenChange={setIsNotesOpen}
              modal={false}
              notes={notes ?? []}
              noteData={{
                entityId,
                entityType: `Business`,
                noteableId: id,
                noteableType: `Workflow`,
              }}
            >
              <NotesButton numberOfNotes={notes?.length ?? 0} />
            </NotesSheet>
            <CustomLabels
              labels={customLabels}
              onAdd={onAddCustomLabel}
              onRemove={onRemoveCustomLabel}
              isDisabled={isWorkflowCompleted}
            />
          </div>
        </div>
        {showResolutionButtons && workflowDefinition && (
          <ActionsVariant
            workflowDefinition={{
              version: workflowDefinition?.version,
              variant: workflowDefinition?.variant,
              config: workflowDefinition?.config,
            }}
          />
        )}
      </div>
    </div>
  );
};

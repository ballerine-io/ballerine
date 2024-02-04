import { StateTag } from '@ballerine/common';
import { Badge } from '@ballerine/ui';
import { FunctionComponent } from 'react';

import { Input } from '@/common/components/atoms/Input/Input';
import { Label } from '@/common/components/atoms/Label/Label';
import { Select } from '@/common/components/atoms/Select/Select';
import { SelectContent } from '@/common/components/atoms/Select/Select.Content';
import { SelectItem } from '@/common/components/atoms/Select/Select.Item';
import { SelectTrigger } from '@/common/components/atoms/Select/Select.Trigger';
import { SelectValue } from '@/common/components/atoms/Select/Select.Value';
import { websiteMonitoringTagsToData } from '@/pages/Entity/components/Case/case-action-variants/WebsiteMonitoringCaseActions/constants';
import { useWebsiteMonitoringCaseActions } from '@/pages/Entity/components/Case/case-action-variants/WebsiteMonitoringCaseActions/hooks/useWebsiteMonitoringCaseActions/useWebsiteMonitoringCaseActions';
import { DialogClose } from '@radix-ui/react-dialog';
import { AssignDropdown } from '../../../../../../common/components/atoms/AssignDropdown/AssignDropdown';
import { Button } from '../../../../../../common/components/atoms/Button/Button';
import { Dialog } from '../../../../../../common/components/organisms/Dialog/Dialog';
import { DialogContent } from '../../../../../../common/components/organisms/Dialog/Dialog.Content';
import { DialogDescription } from '../../../../../../common/components/organisms/Dialog/Dialog.Description';
import { DialogFooter } from '../../../../../../common/components/organisms/Dialog/Dialog.Footer';
import { DialogHeader } from '../../../../../../common/components/organisms/Dialog/Dialog.Header';
import { DialogTitle } from '../../../../../../common/components/organisms/Dialog/Dialog.Title';
import { DialogTrigger } from '../../../../../../common/components/organisms/Dialog/Dialog.Trigger';
import { ctw } from '../../../../../../common/utils/ctw/ctw';
import { tagToBadgeData } from '../../consts';
import { IActionsProps } from '../../interfaces';

/**
 * @description To be used by {@link Case}. Displays the entity's full name, avatar, and handles the reject/approve mutation.
 *
 * @param props
 * @param props.id - The id of the entity, passed into the reject/approve mutation.
 * @param props.fullName - The full name of the entity.
 * @param props.showResolutionButtons - Whether to show the reject/approve buttons.
 *
 * @see {@link Case}
 * @see {@link Avatar}
 *
 * @constructor
 */
export const WebsiteMonitoringCaseActions: FunctionComponent<IActionsProps> = ({
  id,
  fullName,
  showResolutionButtons,
}) => {
  const {
    tag,
    assignedUser,
    authenticatedUser,
    isLoadingCase,
    assignees,
    formValues,
    isLoading,
    isActionsDisabled,
    handleResolutionActionChange,
    handleResolutionCommentChange,
    handleSubmit,
    onMutateAssignWorkflow,
  } = useWebsiteMonitoringCaseActions({ workflowId: id, fullName });

  return (
    <div className={`sticky top-0 z-50 col-span-2 space-y-2 bg-base-100 px-4 pt-4`}>
      <div className={`mb-8 flex flex-row space-x-3.5`}>
        <AssignDropdown
          assignedUser={assignedUser}
          assignees={assignees}
          onAssigneeSelect={id => {
            onMutateAssignWorkflow(id, id === authenticatedUser?.id);
          }}
          authenticatedUserId={authenticatedUser?.id}
        />
      </div>
      <div className={`flex h-20 justify-between`}>
        <div className={`flex flex-col space-y-3`}>
          <h2
            className={ctw(`text-4xl font-semibold leading-9`, {
              'h-8 w-[24ch] animate-pulse rounded-md bg-gray-200 theme-dark:bg-neutral-focus':
                isLoadingCase,
            })}
          >
            {fullName}
          </h2>
          {tag && (
            <div className={`flex items-center`}>
              <span className={`mr-[8px] text-sm leading-6`}>Status</span>
              <Badge
                variant={tagToBadgeData[tag].variant}
                className={ctw(`text-sm font-bold`, {
                  'bg-info/20 text-info': tag === StateTag.MANUAL_REVIEW,
                })}
              >
                {websiteMonitoringTagsToData[tag].text}
              </Badge>
            </div>
          )}
        </div>
        {showResolutionButtons && (
          <Dialog>
            <DialogTrigger asChild>
              <Button size="md" variant="outline" disabled={isActionsDisabled}>
                Resolution Actions
              </Button>
            </DialogTrigger>
            <DialogContent className={`mb-96`}>
              <DialogHeader>
                <DialogTitle className={`text-2xl`}>Resolution Actions</DialogTitle>
                <DialogDescription>
                  <div className="mb-[10px]">Choose an action to perform on the merchant.</div>
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <Label htmlFor="submit-action">Choose action</Label>
                  <Select onValueChange={handleResolutionActionChange} value={formValues.action}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose" id="merchant-monitoring-submit-action" />
                    </SelectTrigger>
                    <SelectContent sticky="always" className="w-full" align="center">
                      <SelectItem value={'resolved'}>Mark as resolved</SelectItem>
                      <SelectItem value={'suspend'}>Suspend Merchant Account</SelectItem>
                      <SelectItem value={'N/A'} disabled>
                        Ask merchant for clarifications
                      </SelectItem>
                      <SelectItem value={'N/A'} disabled>
                        Send to Enhanced Monitoring
                      </SelectItem>
                      <SelectItem value={'N/A'} disabled>
                        Report to Authorities
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-4">
                  <Label htmlFor="merchant-monitoring-comment-input">Comment</Label>
                  <Input
                    placeholder="Add comment"
                    id="merchant-monitoring-comment-input"
                    value={formValues.comment}
                    onChange={handleResolutionCommentChange}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button className={ctw(`gap-x-2`)} disabled={isLoading} onClick={handleSubmit}>
                    Submit
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

import { FunctionComponent } from 'react';

import { Input } from '@/common/components/atoms/Input/Input';
import { Label } from '@/common/components/atoms/Label/Label';
import { Select } from '@/common/components/atoms/Select/Select';
import { SelectContent } from '@/common/components/atoms/Select/Select.Content';
import { SelectItem } from '@/common/components/atoms/Select/Select.Item';
import { SelectTrigger } from '@/common/components/atoms/Select/Select.Trigger';
import { SelectValue } from '@/common/components/atoms/Select/Select.Value';
import { useWebsiteMonitoringCaseActionsLogic } from '@/pages/Entity/components/Case/actions-variants/WebsiteMonitoringCaseActions/hooks/useWebsiteMonitoringCaseActions/useWebsiteMonitoringCaseActions';
import { DialogClose } from '@radix-ui/react-dialog';
import { Button } from '../../../../../../common/components/atoms/Button/Button';
import { Dialog } from '../../../../../../common/components/organisms/Dialog/Dialog';
import { DialogContent } from '../../../../../../common/components/organisms/Dialog/Dialog.Content';
import { DialogDescription } from '../../../../../../common/components/organisms/Dialog/Dialog.Description';
import { DialogFooter } from '../../../../../../common/components/organisms/Dialog/Dialog.Footer';
import { DialogHeader } from '../../../../../../common/components/organisms/Dialog/Dialog.Header';
import { DialogTitle } from '../../../../../../common/components/organisms/Dialog/Dialog.Title';
import { DialogTrigger } from '../../../../../../common/components/organisms/Dialog/Dialog.Trigger';
import { ctw } from '../../../../../../common/utils/ctw/ctw';

export const WebsiteMonitoringActions: FunctionComponent = () => {
  const {
    formValues,
    isLoading,
    isActionsDisabled,
    handleResolutionActionChange,
    handleResolutionCommentChange,
    handleSubmit,
  } = useWebsiteMonitoringCaseActionsLogic();

  return (
    <div className={`sticky top-0 z-50 col-span-2 space-y-2 bg-base-100 px-4 pt-4`}>
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
    </div>
  );
};

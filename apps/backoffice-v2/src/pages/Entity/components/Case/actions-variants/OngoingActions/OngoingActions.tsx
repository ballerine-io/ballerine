import { Dialog } from '@/common/components/organisms/Dialog/Dialog';
import { DialogTrigger } from '@/common/components/organisms/Dialog/Dialog.Trigger';
import { Button } from '@/common/components/atoms/Button/Button';
import { ctw } from '@/common/utils/ctw/ctw';
import { DialogContent } from '@/common/components/organisms/Dialog/Dialog.Content';
import { DialogHeader } from '@/common/components/organisms/Dialog/Dialog.Header';
import { DialogTitle } from '@/common/components/organisms/Dialog/Dialog.Title';
import { DialogDescription } from '@/common/components/organisms/Dialog/Dialog.Description';
import { DialogFooter } from '@/common/components/organisms/Dialog/Dialog.Footer';
import { DialogClose } from '@radix-ui/react-dialog';
import React from 'react';

import { useOngoingActionsLogic } from '@/pages/Entity/components/Case/actions-variants/OngoingActions/hooks/useOngoingActionsLogic/useOngoingActionsLogic';

export const OngoingActions = () => {
  const {
    isLoadingActions,
    debouncedIsLoadingFlagCase,
    onMutateFlagCase,
    canFlag,
    onMutateDismissCase,
    canDismiss,
    debouncedIsLoadingDismissCase,
  } = useOngoingActionsLogic();

  return (
    <div className={`flex items-center space-x-4 self-start pe-[3.35rem]`}>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            size="md"
            variant="destructive"
            disabled={isLoadingActions || !canFlag}
            className={ctw({
              loading: debouncedIsLoadingFlagCase,
            })}
          >
            Flag
          </Button>
        </DialogTrigger>
        <DialogContent className={`mb-96`}>
          <DialogHeader>
            <DialogTitle className={`text-2xl`}>Flagging Confirmation</DialogTitle>
            <DialogDescription asChild>
              <p className="text-sm">Are you sure you want to confirm match?</p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <div className={`space-x-2`}>
                <Button type={'button'} variant={`secondary`}>
                  Cancel
                </Button>
                <Button
                  onClick={onMutateFlagCase}
                  disabled={isLoadingActions || !canFlag}
                  className={ctw({
                    loading: debouncedIsLoadingFlagCase,
                  })}
                >
                  Flag
                </Button>
              </div>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            size="md"
            variant="success"
            disabled={isLoadingActions || !canDismiss}
            className={ctw({
              loading: debouncedIsLoadingDismissCase,
            })}
          >
            Dismiss
          </Button>
        </DialogTrigger>
        <DialogContent className={`mb-96`}>
          <DialogHeader>
            <DialogTitle className={`text-2xl`}>Dismissal Confirmation</DialogTitle>
            <DialogDescription asChild>
              <p className="text-sm">Are you sure you want to dismiss?</p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <div className={`space-x-2`}>
                <Button type={'button'} variant={`secondary`}>
                  Cancel
                </Button>
                <Button
                  onClick={onMutateDismissCase}
                  disabled={isLoadingActions || !canDismiss}
                  className={ctw({
                    loading: debouncedIsLoadingDismissCase,
                  })}
                >
                  Dismiss
                </Button>
              </div>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

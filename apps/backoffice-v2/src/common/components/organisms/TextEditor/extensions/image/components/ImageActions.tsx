import * as React from 'react';
import {
  ClipboardCopyIcon,
  DotsHorizontalIcon,
  DownloadIcon,
  Link2Icon,
  SizeIcon,
} from '@radix-ui/react-icons';
import { ctw } from '@/common/utils/ctw/ctw';
import { Tooltip } from '@/common/components/atoms/Tooltip/Tooltip';
import { TooltipTrigger } from '@/common/components/atoms/Tooltip/Tooltip.Trigger';
import { Button } from '@/common/components/atoms/Button/Button';
import { TooltipContent } from '@/common/components/atoms/Tooltip/Tooltip.Content';
import { DropdownMenu } from '@/common/components/molecules/DropdownMenu/DropdownMenu';
import { DropdownMenuTrigger } from '@/common/components/molecules/DropdownMenu/DropdownMenu.Trigger';
import { DropdownMenuContent } from '@/common/components/molecules/DropdownMenu/DropdownMenu.Content';
import { DropdownMenuItem } from '@/common/components/molecules/DropdownMenu/DropdownMenu.Item';

interface ImageActionsProps {
  shouldMerge?: boolean;
  isLink?: boolean;
  onView?: () => void;
  onDownload?: () => void;
  onCopy?: () => void;
  onCopyLink?: () => void;
}

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  tooltip: string;
}

export const ActionWrapper = React.memo(
  React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ children, className, ...props }, ref) => (
      <div
        ref={ref}
        className={ctw(
          'absolute right-3 top-3 flex flex-row rounded px-0.5 opacity-0 group-hover/node-image:opacity-100',
          'border-[0.5px] bg-[var(--mt-bg-secondary)] [backdrop-filter:saturate(1.8)_blur(20px)]',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    ),
  ),
);

ActionWrapper.displayName = 'ActionWrapper';

export const ActionButton = React.memo(
  React.forwardRef<HTMLButtonElement, ActionButtonProps>(
    ({ icon, tooltip, className, ...props }, ref) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            ref={ref}
            variant="ghost"
            className={ctw(
              'relative flex h-7 w-7 flex-row rounded-none p-0 text-muted-foreground hover:text-foreground',
              'bg-transparent hover:bg-transparent',
              className,
            )}
            {...props}
          >
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">{tooltip}</TooltipContent>
      </Tooltip>
    ),
  ),
);

ActionButton.displayName = 'ActionButton';

type ActionKey = 'onView' | 'onDownload' | 'onCopy' | 'onCopyLink';

const ActionItems: Array<{
  key: ActionKey;
  icon: React.ReactNode;
  tooltip: string;
  isLink?: boolean;
}> = [
  { key: 'onView', icon: <SizeIcon className="size-4" />, tooltip: 'View image' },
  { key: 'onDownload', icon: <DownloadIcon className="size-4" />, tooltip: 'Download image' },
  {
    key: 'onCopy',
    icon: <ClipboardCopyIcon className="size-4" />,
    tooltip: 'Copy image to clipboard',
  },
  {
    key: 'onCopyLink',
    icon: <Link2Icon className="size-4" />,
    tooltip: 'Copy image link',
    isLink: true,
  },
];

export const ImageActions: React.FC<ImageActionsProps> = React.memo(
  ({ shouldMerge = false, isLink = false, ...actions }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleAction = React.useCallback(
      (e: React.MouseEvent, action: (() => void) | undefined) => {
        e.preventDefault();
        e.stopPropagation();
        action?.();
      },
      [],
    );

    const filteredActions = React.useMemo(
      () => ActionItems.filter(item => isLink || !item.isLink),
      [isLink],
    );

    return (
      <ActionWrapper className={ctw({ 'opacity-100': isOpen })}>
        {shouldMerge ? (
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <ActionButton
                icon={<DotsHorizontalIcon className="size-4" />}
                tooltip="Open menu"
                onClick={e => e.preventDefault()}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              {filteredActions.map(({ key, icon, tooltip }) => (
                <DropdownMenuItem key={key} onClick={e => handleAction(e, actions[key])}>
                  <div className="flex flex-row items-center gap-2">
                    {icon}
                    <span>{tooltip}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          filteredActions.map(({ key, icon, tooltip }) => (
            <ActionButton
              key={key}
              icon={icon}
              tooltip={tooltip}
              onClick={e => handleAction(e, actions[key])}
            />
          ))
        )}
      </ActionWrapper>
    );
  },
);

ImageActions.displayName = 'ImageActions';

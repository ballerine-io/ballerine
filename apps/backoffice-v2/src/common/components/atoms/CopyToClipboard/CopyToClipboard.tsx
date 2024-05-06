import { CopySvg } from '@/common/components/atoms/icons';
import { Button } from '@/common/components/atoms/Button/Button';
import { ComponentProps, FunctionComponent } from 'react';
import { copyToClipboard } from '@/common/utils/copy-to-clipboard/copy-to-clipboard';
import { ctw } from '@ballerine/ui';

interface ICopyToClipboardProps extends ComponentProps<typeof Button> {
  textToCopy: string;
}

export const CopyToClipboard: FunctionComponent<ICopyToClipboardProps> = ({
  textToCopy,
  className,
  ...props
}) => {
  return (
    <Button
      variant={'ghost'}
      size={'icon'}
      onClick={copyToClipboard(textToCopy)}
      className={ctw(`h-[unset] opacity-80 hover:bg-transparent hover:opacity-100`, className)}
      {...props}
    >
      <CopySvg className={`d-4`} />
    </Button>
  );
};

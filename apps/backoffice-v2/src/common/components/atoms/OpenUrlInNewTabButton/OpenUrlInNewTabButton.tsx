import { ExternalLink } from 'lucide-react';
import { ComponentProps, FunctionComponent } from 'react';
import { buttonVariants } from '@/common/components/atoms/Button/Button';
import { ctw } from '@/common/utils/ctw/ctw';

export const OpenUrlInNewTabButton: FunctionComponent<ComponentProps<'a'>> = ({
  href,
  ...props
}) => {
  return (
    <a
      href={href}
      target={'_blank'}
      rel={'noopener noreferrer'}
      aria-disabled={!href}
      {...props}
      className={ctw(
        buttonVariants({
          variant: 'ghost',
          size: 'icon',
          className: 'p-1 d-9',
        }),
        {
          'pointer-events-none opacity-50': !href,
        },
      )}
    >
      <ExternalLink className="text-blue-500" />
    </a>
  );
};

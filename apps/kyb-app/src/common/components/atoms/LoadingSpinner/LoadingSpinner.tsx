import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

type Props = React.ComponentProps<typeof Loader2>;

export const LoadingSpinner = (props: Props) => {
  return <Loader2 {...props} className={clsx('animate-spin', props.className)} />;
};

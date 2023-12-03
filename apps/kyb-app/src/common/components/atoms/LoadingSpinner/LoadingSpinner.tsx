import { ctw } from '@ballerine/ui';
import { Loader2 } from 'lucide-react';

type Props = React.ComponentProps<typeof Loader2>;

export const LoadingSpinner = (props: Props) => {
  return <Loader2 {...props} className={ctw('animate-spin', props.className)} />;
};

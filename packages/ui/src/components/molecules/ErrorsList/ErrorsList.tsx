import { ErrorMessage } from '@/components/atoms';
import clsx from 'clsx';

interface Props {
  errors: string[];
  type?: 'error' | 'warning';
  className?: string;
}

export const ErrorsList = ({ errors, type = 'error', className }: Props) => {
  return (
    <ul className={clsx('pl-1', className)}>
      {errors.map((error) => (
        <li key={error}>
          <ErrorMessage
            text={error}
            className={type === 'warning' ? 'text-amber-400' : undefined}
          />
        </li>
      ))}
    </ul>
  );
};

import { ErrorMessage } from '@/components/atoms';
import clsx from 'clsx';

interface Props {
  errors: string[];
  type?: 'error' | 'warning';
  className?: string;
  testId?: string;
}

export const ErrorsList = ({ errors, type = 'error', className, testId }: Props) => {
  return (
    <ul
      className={clsx('pl-1', className)}
      data-testid={testId ? `${testId}-errors-list` : undefined}
    >
      {errors.map((error, index) => (
        <li
          key={`error-list-item-${index}`}
          data-testid={testId ? `${testId}-error-list-item-${index}` : undefined}
        >
          <ErrorMessage
            text={error}
            className={type === 'warning' ? 'text-amber-400' : undefined}
          />
        </li>
      ))}
    </ul>
  );
};

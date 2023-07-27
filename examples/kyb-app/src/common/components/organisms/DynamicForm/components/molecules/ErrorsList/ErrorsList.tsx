import clsx from 'clsx';
import { ErrorMessage } from '@app/common/components/organisms/DynamicForm/components/atoms/ErrorMessage';

interface Props {
  errors: string[];
  type?: 'error' | 'warning';
  className?: string;
}

export const ErrorsList = ({ errors, type = 'error', className }: Props) => {
  return (
    <ul className={clsx('pl-2', className)}>
      {errors.map((error, index) => (
        <li key={`error-list-item-${index}`}>
          <ErrorMessage
            text={error}
            className={type === 'warning' ? 'text-amber-400' : undefined}
          />
        </li>
      ))}
    </ul>
  );
};

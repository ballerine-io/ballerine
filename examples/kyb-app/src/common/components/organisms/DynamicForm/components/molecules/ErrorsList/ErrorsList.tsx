import clsx from 'clsx';
import { ErrorMessage } from '@app/common/components/organisms/DynamicForm/components/atoms/ErrorMessage';

interface Props {
  errors: string[];
  className?: string;
}

export const ErrorsList = ({ errors, className }: Props) => {
  return (
    <ul className={clsx('pl-2', className)}>
      {errors.map((error, index) => (
        <li key={`error-list-item-${index}`}>
          <ErrorMessage text={error} />
        </li>
      ))}
    </ul>
  );
};

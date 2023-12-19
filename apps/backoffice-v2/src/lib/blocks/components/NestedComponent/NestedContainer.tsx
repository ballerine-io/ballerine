import { FunctionComponentWithChildren } from '../../../../common/types';
import { INestedContainerProps } from './interfaces';

export const NestedContainer: FunctionComponentWithChildren<INestedContainerProps> = ({
  children,
  isNested,
}) => {
  if (!isNested) return <>{children}</>;

  return <div className={`my-2 grid grid-cols-2 gap-4 gap-y-6`}>{children}</div>;
};

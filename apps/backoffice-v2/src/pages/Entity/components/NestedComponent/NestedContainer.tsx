import { FunctionComponentWithChildren } from '../../../../common/types';
import { INestedContainerProps } from './interfaces';

export const NestedContainer: FunctionComponentWithChildren<INestedContainerProps> = ({
  children,
  isNested,
}) => {
  if (!isNested) return <>{children}</>;

  return <div className={`my-2 grid grid-cols-4 gap-8`}>{children}</div>;
};

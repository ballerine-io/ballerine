import { Provider } from './context';
import { IGroupProps } from 'components/atoms/Checkbox/interfaces';
import { FunctionComponentWithChildren } from '../../../types';
import { ctw } from '../../../utils/ctw/ctw';

export const Group: FunctionComponentWithChildren<IGroupProps> = ({
  vertical = false,
  children,
  label,
  values = [],
  onChange,
  titleProps = {},
}) => {
  const { className, ...restTitle } = titleProps;

  return (
    <Provider values={values} onChange={onChange}>
      <div>
        <h4 className={ctw(`mb-2 text-base-content`, className)} {...restTitle}>
          {label}
        </h4>
        <div
          className={ctw(`flex gap-2`, {
            'flex-col': vertical,
          })}
        >
          {children}
        </div>
      </div>
    </Provider>
  );
};

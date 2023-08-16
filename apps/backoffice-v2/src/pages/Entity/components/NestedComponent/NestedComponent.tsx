import { FunctionComponentWithChildren } from '../../../../common/types';
import { ctw } from '../../../../common/utils/ctw/ctw';
import { convertSnakeCaseToTitleCase } from '../../hooks/useEntity/utils';
import { isObject, noNullish } from '@ballerine/common';
import { FunctionComponent } from 'react';
import { INestedComponentProps } from './interfaces';

export const NestedComponent: FunctionComponent<INestedComponentProps> = ({
  id,
  value,
  isNested = false,
}) => {
  if (!value?.data?.length) return;

  const Container: FunctionComponentWithChildren = ({ children }) => {
    if (!isNested) return <>{children}</>;

    return <div className={`mb-4 grid grid-cols-2 gap-4`}>{children}</div>;
  };

  return (
    <Container>
      {value?.data?.map(({ title, value }) => {
        return (
          <div key={title}>
            <h4
              className={ctw(`mb-1 text-lg font-bold`, {
                'text-2xl': !isNested,
                'text-slate-400': isNested,
              })}
            >
              {noNullish`${convertSnakeCaseToTitleCase(title)}`}
            </h4>
            {isObject(value) && (
              <NestedComponent
                isNested
                id={id}
                value={{
                  data: Object.entries(value)?.map(([title, value]) => ({
                    title,
                    value,
                  })),
                }}
              />
            )}
            {Array.isArray(value) && <p>{value.join(', ')}</p>}
            {!isObject(value) && !Array.isArray(value) && <p>{value}</p>}
          </div>
        );
      })}
    </Container>
  );
};

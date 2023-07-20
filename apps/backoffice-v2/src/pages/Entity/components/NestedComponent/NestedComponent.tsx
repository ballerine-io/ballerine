import { ctw } from '../../../../common/utils/ctw/ctw';
import { isNullish, isObject } from '@ballerine/common';
import { FunctionComponent } from 'react';
import { INestedComponentProps } from './interfaces';
import { keyFactory } from '../../../../common/utils/key-factory/key-factory';
import { camelCaseToSpace } from '../../../../common/utils/camel-case-to-space/camel-case-to-space';
import { NestedContainer } from './NestedContainer';

export const NestedComponent: FunctionComponent<INestedComponentProps> = ({
  id,
  value,
  isNested = false,
}) => {
  if (!value?.data?.length) return;

  return (
    <NestedContainer isNested={isNested}>
      {value?.data?.map(({ title, value }) => {
        return (
          <div key={title} className={`my-1`}>
            <h4
              className={ctw(`mb-1 text-lg font-bold capitalize`, {
                'text-2xl': !isNested,
                'text-slate-400': isNested,
              })}
            >
              {camelCaseToSpace(title)}
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
            {Array.isArray(value) &&
              value?.map((item, index) => {
                if (isObject(item)) {
                  return (
                    <NestedComponent
                      key={keyFactory(index?.toString(), id, title, `nested-component`)}
                      isNested
                      id={id}
                      value={{
                        data: Object.entries(item)?.map(([title, value]) => ({
                          title,
                          value,
                        })),
                      }}
                    />
                  );
                }

                if (Array.isArray(item)) {
                  return (
                    <NestedComponent
                      key={keyFactory(index?.toString(), id, title, `nested-component`)}
                      isNested
                      id={id}
                      value={{
                        data: item?.map(item => ({
                          title: 'Custom Property',
                          value: item,
                        })),
                      }}
                    />
                  );
                }

                if (!isObject(item) && !Array.isArray(item)) {
                  return (
                    <p key={keyFactory(index?.toString(), id, title, `nested-component`)}>
                      {isNullish(item) ? '' : item?.toString()}
                    </p>
                  );
                }
              })}
            {!isObject(value) && !Array.isArray(value) && (
              <p>{isNullish(value) ? '' : value?.toString()}</p>
            )}
          </div>
        );
      })}
    </NestedContainer>
  );
};

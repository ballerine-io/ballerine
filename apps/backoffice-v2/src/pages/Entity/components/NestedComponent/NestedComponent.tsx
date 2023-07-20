import { ctw } from '../../../../common/utils/ctw/ctw';
import { isObject } from '@ballerine/common';
import { FunctionComponent } from 'react';
import { INestedComponentProps } from './interfaces';
import { keyFactory } from '../../../../common/utils/key-factory/key-factory';
import { camelCaseToSpace } from '../../../../common/utils/camel-case-to-space/camel-case-to-space';
import { NestedContainer } from './NestedContainer';
import { handleNestedValue } from './handle-nested-value';

export const NestedComponent: FunctionComponent<INestedComponentProps> = ({
  id,
  value,
  isNested = false,
}) => {
  if (!value?.data?.length) return;

  return (
    <NestedContainer isNested={isNested}>
      {value?.data?.map(({ title, value, showNull, showUndefined }) => {
        return (
          <div key={title}>
            <h4
              className={ctw(
                `text-lg font-medium capitalize leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70`,
                {
                  'text-xl': !isNested,
                  'mb-4 text-2xl': isObject(value) || Array.isArray(value),
                },
              )}
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
                    <p
                      className={`leading-7 [&:not(:first-child)]:mt-2`}
                      key={keyFactory(index?.toString(), id, title, `nested-component`)}
                    >
                      {handleNestedValue({ value, showUndefined, showNull })}
                    </p>
                  );
                }
              })}
            {!isObject(value) && !Array.isArray(value) && (
              <p className={`leading-7 [&:not(:first-child)]:mt-2`}>
                {handleNestedValue({ value, showUndefined, showNull })}
              </p>
            )}
          </div>
        );
      })}
    </NestedContainer>
  );
};

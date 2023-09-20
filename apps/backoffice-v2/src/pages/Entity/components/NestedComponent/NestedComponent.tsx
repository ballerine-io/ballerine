import { ctw } from '../../../../common/utils/ctw/ctw';
import { isObject } from '@ballerine/common';
import { FunctionComponent } from 'react';
import { INestedComponentProps } from './interfaces';
import { keyFactory } from '../../../../common/utils/key-factory/key-factory';
import { camelCaseToSpace } from '../../../../common/utils/camel-case-to-space/camel-case-to-space';
import { NestedContainer } from './NestedContainer';
import { handleNestedValue } from './handle-nested-value';
import { isValidUrl } from '../../../../common/utils/is-valid-url';
import { buttonVariants } from '../../../../common/components/atoms/Button/Button';

export const NestedComponent: FunctionComponent<INestedComponentProps> = ({
  id,
  value,
  isNested = false,
}) => {
  if (!value?.data?.length) return;

  return (
    <NestedContainer isNested={isNested}>
      {value?.data?.map(({ title, value, showNull, showUndefined, anchorUrls }) => {
        const Component = anchorUrls && isValidUrl(value) ? 'a' : 'p';

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
                    showUndefined,
                    showNull,
                    anchorUrls,
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
                          showUndefined,
                          showNull,
                          anchorUrls,
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
                          showUndefined,
                          showNull,
                          anchorUrls,
                        })),
                      }}
                    />
                  );
                }

                if (!isObject(item) && !Array.isArray(item)) {
                  return (
                    <Component
                      className={`leading-7 [&:not(:first-child)]:mt-2`}
                      key={keyFactory(index?.toString(), id, title, `nested-component`)}
                    >
                      {handleNestedValue({ value, showUndefined, showNull })}
                    </Component>
                  );
                }
              })}
            {!isObject(value) && !Array.isArray(value) && (
              <Component
                className={`leading-7 [&:not(:first-child)]:mt-2`}
                {...(Component === 'a'
                  ? {
                      // Component === 'a' only if `value` is a string.
                      href: value as string,
                      target: '_blank',
                      rel: 'noopener noreferrer',
                      className: buttonVariants({ variant: 'link', className: '!p-0' }),
                    }
                  : {})}
              >
                {handleNestedValue({ value, showUndefined, showNull })}
              </Component>
            )}
          </div>
        );
      })}
    </NestedContainer>
  );
};

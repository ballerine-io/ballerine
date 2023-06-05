import { isNullish } from '@ballerine/common';
import { IDataFieldProps } from './interfaces';
import { FunctionComponent } from 'react';
import { ctw } from '../../../utils/ctw/ctw';

/**
 * @description A component which uses a div to wrap an h4 and a p element in order to display data.
 *
 *
 * @param props - Props to pass to the root div component.
 * @param props.title - The content to display within the h4 element.
 * @param props.text - The content to display within the p element.
 * @param props.titleProps - Props to pass to the h4 element.
 * @param props.textProps - Props to pass to the p element.
 * @constructor
 */
export const DataField: FunctionComponent<IDataFieldProps> = ({
  title,
  text,
  titleProps = {},
  textProps = {},
  loading,
  ...rest
}) => {
  const { className: titleClassName, ...titleRest } = titleProps;
  const { className: textClassName, ...textRest } = textProps;
  const sharedStyles = `break-words leading-[1.5rem] min-h-[1.25rem]`;

  return (
    <div {...rest}>
      <h4
        className={ctw(
          'font-bold',
          {
            'w-10/12 animate-pulse rounded-md bg-gray-200 theme-dark:bg-neutral-focus':
              loading?.title,
          },
          sharedStyles,
          titleClassName,
        )}
        {...titleRest}
      >
        {loading?.title || isNullish(title)
          ? ''
          : // Allows rendering 'true' 'false', etc.
            title.toString()}
      </h4>
      <p
        className={ctw(
          {
            'mt-1 w-6/12 animate-pulse rounded-md bg-gray-200 theme-dark:bg-neutral-focus':
              loading?.text,
          },
          `text-base-content/70`,
          sharedStyles,
          textClassName,
        )}
        {...textRest}
      >
        {loading?.text || isNullish(text) ? '' : text.toString()}
      </p>
    </div>
  );
};

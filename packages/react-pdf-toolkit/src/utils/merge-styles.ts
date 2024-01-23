import { AnyObject } from '@ballerine/ui';

export const mergeStyles = (styles: AnyObject[]): AnyObject => {
  return styles.reduce((style, styleItem) => {
    return {
      ...style,
      ...styleItem,
    };
  }, {});
};

import { AnyRecord } from '@ballerine/common';

export const generateTitleCell = ({
  title,
  context,
  subtitle,
  titleUiElements,
  subTitleUiElements,
}: {
  title?: string;
  titleUiElements?: AnyRecord;
  subtitle?: string;
  subTitleUiElements?: AnyRecord;
  context: string;
}) => {
  const titleElements = []; // TODO: add type ui element

  if (title) {
    titleElements.push({
      name: `${context.toLowerCase().replace(' ', '')}_title`,
    });
  }

  if (subtitle) {
    titleElements.push({
      name: `${context.toLowerCase().replace(' ', '')}_subtitle`,
      type: 'subtitle',
      value: subtitle,
      uiElements: subTitleUiElements,
    });
  }

  return titleElements;
};

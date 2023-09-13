export const generateTitleCell = ({
  title,
  context,
  subtitle,
}: {
  title?: string;
  subtitle?: string;
  context: string;
}) => {
  let titleUiElements = []; // TODO: add type ui element

  if (title) {
    titleUiElements.push({
      name: `${context.toLowerCase().replace(' ', '')}_title`,
      type: 'title',
      value: title,
    });
  }

  if (subtitle) {
    titleUiElements.push({
      name: `${context.toLowerCase().replace(' ', '')}_subtitle`,
      type: 'subtitle',
      value: subtitle,
    });
  }

  return titleUiElements;
};

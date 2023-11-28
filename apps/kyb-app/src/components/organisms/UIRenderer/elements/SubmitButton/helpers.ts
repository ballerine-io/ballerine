import { UIElement, UIPage } from '@/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';

export const getElementNames = (page: UIPage) => {
  const elementNames: string[] = [];

  const pickNames = (elements: UIElement<AnyObject>[]) => {
    elements.forEach(element => {
      if (element.name) {
        elementNames.push(element.name);
      }

      if (element.elements) {
        pickNames(element.elements);
      }
    });
  };

  pickNames(page.elements);

  return elementNames;
};

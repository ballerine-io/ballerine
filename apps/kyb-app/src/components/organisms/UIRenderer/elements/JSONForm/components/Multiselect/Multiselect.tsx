import { UIElement } from '@app/domains/collection-flow';
import {
  Chip,
  MultiSelectSelectedItemRenderer,
  MultiselectInputAdapter,
  RJSFInputProps,
} from '@ballerine/ui';
import { X } from 'lucide-react';
import { useCallback } from 'react';

export interface MultiselectParams {
  variants: {
    chip: {
      wrapper: 'primary' | 'secondary';
      label: 'primary' | 'secondary';
    };
  };
}

export const Multiselect = ({
  definition,
  ...adapterProps
}: RJSFInputProps & { definition?: UIElement<MultiselectParams> }) => {
  const renderSelected: MultiSelectSelectedItemRenderer = useCallback((params, option) => {
    return (
      <Chip key={option.value} className="h-6" variant={definition.options.variants?.chip?.wrapper}>
        <Chip.Label text={option.title} variant={definition.options.variants?.chip?.label} />
        <Chip.UnselectButton
          {...params.unselectButtonProps}
          icon={<X className="hover:text-muted-foreground h-3 w-3 text-white" />}
        />
      </Chip>
    );
  }, []);

  return <MultiselectInputAdapter {...(adapterProps as any)} renderSelected={renderSelected} />;
};

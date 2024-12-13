import { FieldLayout } from '@/pages/CollectionFlowV2/components/ui/field-parts/FieldLayout';
import { IFieldComponentProps } from '@/pages/CollectionFlowV2/types';
import { Tag, TagInput } from 'emblor';
import { FunctionComponent, useMemo, useState } from 'react';

export interface ITagsFieldOptions {
  placeholder?: string;
}

export const TagsField: FunctionComponent<IFieldComponentProps<string[], ITagsFieldOptions>> = ({
  fieldProps,
  definition,
  options,
  stack,
}) => {
  const { value, onBlur, onChange } = fieldProps;
  const { placeholder } = options || {};

  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  const tags = useMemo(() => {
    if (!Array.isArray(value)) return [];

    return value.map((tag, index) => {
      return {
        id: String(index),
        text: String(tag),
      } satisfies Tag;
    });
  }, [value]);

  return (
    <FieldLayout definition={definition} stack={stack}>
      <TagInput
        onBlur={onBlur}
        setTags={tags => onChange((tags as Tag[]).map(tag => tag.text))}
        tags={tags}
        activeTagIndex={activeTagIndex}
        setActiveTagIndex={setActiveTagIndex}
        placeholder={placeholder}
        addTagsOnBlur
      />
    </FieldLayout>
  );
};

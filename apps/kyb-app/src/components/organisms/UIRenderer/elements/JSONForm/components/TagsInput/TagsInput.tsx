import { RJSFInputProps } from '@ballerine/ui';
import { Tag, TagInput } from 'emblor';
import { FunctionComponent, useMemo, useState } from 'react';

export type ITagsInputProps = RJSFInputProps;

export const TagsInput: FunctionComponent<ITagsInputProps> = ({
  onBlur,
  onChange,
  formData,
  id,
  uiSchema,
}) => {
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  const tags = useMemo(() => {
    if (!Array.isArray(formData)) return [];

    return formData.map((tag, index) => {
      return {
        id: String(index),
        text: String(tag),
      } satisfies Tag;
    });
  }, [formData]);

  return (
    <TagInput
      onBlur={() => onBlur(id!, formData)}
      setTags={tags => onChange((tags as Tag[]).map(tag => tag.text))}
      tags={tags}
      activeTagIndex={activeTagIndex}
      setActiveTagIndex={setActiveTagIndex}
      placeholder={uiSchema?.['ui:placeholder']}
      addTagsOnBlur
      styleClasses={{
        input:
          'border-none outline-none focus:outline-none focus:ring-0 shadow-none placeholder:text-muted-foreground',
      }}
    />
  );
};

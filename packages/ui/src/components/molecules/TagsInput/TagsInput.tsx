import { Tag, TagInput, TagInputProps } from 'emblor';
import { FunctionComponent, useMemo, useState } from 'react';

export interface ITagsInputProps
  extends Omit<TagInputProps, 'value' | 'testId' | 'onChange' | 'onBlur' | 'onFocus'> {
  value?: string[];
  testId?: string;
  onChange?: (tags: string[]) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

export const TagsInput: FunctionComponent<ITagsInputProps> = ({
  value,
  testId,
  onChange,
  onBlur,
  onFocus,
  ...props
}) => {
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  const tags = useMemo(() => {
    if (!Array.isArray(value)) {
      return [];
    }

    return value.map((tag, index) => {
      return {
        id: String(index),
        text: String(tag),
      } satisfies Tag;
    });
  }, [value]);

  return (
    <TagInput
      {...props}
      data-testid={testId}
      onBlur={onBlur}
      onFocus={onFocus}
      setTags={tags => onChange?.((tags as Tag[]).map(tag => tag.text))}
      tags={tags}
      activeTagIndex={activeTagIndex}
      setActiveTagIndex={setActiveTagIndex}
      addTagsOnBlur
      styleClasses={{
        ...props.styleClasses,
        input:
          'border-none outline-none focus:outline-none focus:ring-0 shadow-none placeholder:text-muted-foreground',
      }}
    />
  );
};

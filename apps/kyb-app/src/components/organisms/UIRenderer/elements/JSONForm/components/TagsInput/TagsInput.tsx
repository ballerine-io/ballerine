import { RJSFInputProps } from '@ballerine/ui';
import { TagInput } from 'emblor';
import { FunctionComponent, useState } from 'react';

export type ITagsInputProps = RJSFInputProps;

export const TagsInput: FunctionComponent<ITagsInputProps> = (props: RJSFInputProps) => {
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  console.log({ value: props.formData });

  return (
    <TagInput
      onBlur={() => props.onBlur(props.id!, props.formData)}
      setTags={tags => {
        console.log({ tags });
        props.onChange(tags);
        console.log({ props });
      }}
      tags={props.formData || []}
      activeTagIndex={activeTagIndex}
      setActiveTagIndex={setActiveTagIndex}
    />
  );
};

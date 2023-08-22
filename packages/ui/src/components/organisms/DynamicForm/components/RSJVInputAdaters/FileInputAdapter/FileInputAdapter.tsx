import { Input, Label } from '@components/atoms';
import { RJSVInputAdapter } from '@components/organisms/DynamicForm/components/RSJVInputAdaters/types';
import { useCallback, useEffect, useRef } from 'react';

export const FileInputAdapter: RJSVInputAdapter<File> = ({
  id,
  name,
  uiSchema,
  schema,
  formData,
  disabled,
  onChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    if (!inputRef.current.files.length) {
      const files = new DataTransfer();

      if (!(formData instanceof File)) return;

      files.items.add(formData);
      inputRef.current.files = files.files;
    }
  }, [formData, inputRef, onChange]);

  const handleChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files[0];
      if (!file) return;

      onChange(file);
    },
    [onChange],
  );

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{schema.title}</Label>
      <Input
        ref={inputRef}
        type="file"
        id={id}
        name={name}
        placeholder={uiSchema['ui:placeholder']}
        onChange={e => void handleChange(e)}
        accept="image/jpeg, image/png, application/pdf, .docx"
        className="line-1 flex items-center"
        disabled={disabled}
      />
    </div>
  );
};

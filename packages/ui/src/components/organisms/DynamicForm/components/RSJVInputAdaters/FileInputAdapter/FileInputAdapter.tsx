import { Input } from '@components/atoms';
import { RJSVInputAdapter } from '@components/organisms/DynamicForm/components/RSJVInputAdaters/types';
import { useCallback, useEffect, useRef } from 'react';

export const FileInputAdapter: RJSVInputAdapter<File> = ({
  id,
  name,
  uiSchema,
  formData,
  disabled,
  onChange,
  onBlur,
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

  const handleBlur = useCallback(() => {
    onBlur && onBlur(id, formData);
  }, [id, onBlur, formData]);

  return (
    <div className="flex flex-col gap-2">
      <Input
        ref={inputRef}
        type="file"
        id={id}
        name={name}
        placeholder={uiSchema['ui:placeholder']}
        //@ts-ignore
        onChange={handleChange}
        accept="image/jpeg, image/png, application/pdf, .docx"
        className="line-1 flex items-center"
        disabled={disabled}
        onBlur={handleBlur}
      />
    </div>
  );
};

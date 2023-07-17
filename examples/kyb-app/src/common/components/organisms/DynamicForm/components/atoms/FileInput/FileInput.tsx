import { useFileStorage } from '@app/common/providers/FileStorageProvider';
import { Input } from '@ballerine/ui';
import { Label } from '@ballerine/ui';
import { FieldProps } from '@rjsf/utils';
import { useCallback, useEffect, useRef } from 'react';

export const FileInput = ({ id, name, uiSchema, schema, formData, onChange }: FieldProps) => {
  const { storage } = useFileStorage();

  const inputRef = useRef<HTMLInputElement>(null);

  if (!storage) {
    throw new Error('It seems FileInput is used but FileStorage not provided.');
  }

  useEffect(() => {
    if (!inputRef.current) return;

    const fileId = formData as string;

    if (!inputRef.current.files.length && storage.isExists(fileId)) {
      const files = new DataTransfer();
      files.items.add(storage.get(fileId));

      inputRef.current.files = files.files;
    }
  }, [inputRef]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files[0];
      if (!file) return;

      const fileId = storage.add(file);

      onChange(fileId);
    },
    [storage, onChange],
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
        onChange={handleChange}
        accept="image/jpeg, image/png, application/pdf, .docx"
      />
    </div>
  );
};

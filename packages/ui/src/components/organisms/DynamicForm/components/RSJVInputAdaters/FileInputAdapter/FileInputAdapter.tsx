import { base64ToFile, fileToBase64 } from '@common/utils';
import { Input, Label } from '@components/atoms';
import { RJSVInputAdapter } from '@components/organisms/DynamicForm/components/RSJVInputAdaters/types';
import { isBase64 } from '@components/organisms/DynamicForm/utils/is-base64';
import { useCallback, useEffect, useRef } from 'react';

export const FileInputAdapter: RJSVInputAdapter = ({
  id,
  name,
  uiSchema,
  schema,
  formData,
  onChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    if (!inputRef.current.files.length) {
      const files = new DataTransfer();

      if (!formData) return;

      const isBase64Value = typeof formData === 'string' && isBase64(formData);

      if (isBase64Value) {
        const fileMetadata = JSON.parse(atob(formData)) as {
          name: string;
          type: string;
          file: string;
        };

        void base64ToFile(fileMetadata.file, fileMetadata.name, fileMetadata.type).then(file => {
          files.items.add(file);
          inputRef.current.files = files.files;
        });
      }
    }
  }, [formData, inputRef, onChange]);

  const handleChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files[0];
      if (!file) return;

      const filePayload = btoa(
        JSON.stringify({
          type: file.type,
          name: file.name,
          file: await fileToBase64(file),
        }),
      );

      onChange(filePayload);
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
      />
    </div>
  );
};

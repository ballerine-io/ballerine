import { useWarnings } from '@app/common/components/organisms/DynamicForm/hooks/useWarnings/useWarnings';
import { base64ToFile } from '@app/common/utils/base64-to-file';
import { fileToBase64 } from '@app/common/utils/file-to-base64';
import { isBase64 } from '@app/utils/is-base-64';
import { Input } from '@ballerine/ui';
import { Label } from '@ballerine/ui';
import { FieldProps } from '@rjsf/utils';
import { useCallback, useEffect, useRef } from 'react';

export const FileInput = ({
  id,
  name,
  uiSchema,
  schema,
  formData,
  onChange,
}: FieldProps<string>) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    if (!inputRef.current.files.length) {
      const files = new DataTransfer();

      if (!formData) return;

      const isBase64Value = typeof formData === 'string' && isBase64(formData);
      let file: null | File = null;

      if (isBase64Value) {
        const fileMetadata = JSON.parse(atob(formData)) as {
          name: string;
          type: string;
          file: string;
        };

        file = base64ToFile(fileMetadata.file, fileMetadata.name, fileMetadata.type);
        files.items.add(file);
      }

      inputRef.current.files = files.files;
    }
  }, [formData, inputRef, onChange]);

  const handleChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files[0];
      if (!file) return;

      const base64File = btoa(
        JSON.stringify({ type: file.type, name: file.name, file: await fileToBase64(file) }),
      );

      onChange(base64File);
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

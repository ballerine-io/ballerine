import { useEffect } from 'react';

export const useFileAssigner = (
  ref: React.MutableRefObject<HTMLInputElement>,
  file?: File | null,
) => {
  useEffect(() => {
    if (!ref.current) return;

    if (!ref.current.files.length) {
      const files = new DataTransfer();

      if (!(file instanceof File)) return;

      files.items.add(file);
      ref.current.files = files.files;
    }
  }, [file, ref]);
};

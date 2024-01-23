import { updateLanguage } from '@/domains/collection-flow';
import { useMutation } from '@tanstack/react-query';

export const useLanguageQuery = () =>
  useMutation({
    mutationFn: (language: string) => updateLanguage(language),
  });

import i18next from 'i18next';
import { useMemo } from 'react';

import { LoadingSpinner } from '@/common/components/atoms/LoadingSpinner';
import { GlobeIcon } from '@/common/icons';
import { useLanguageParam } from '@/hooks/useLanguageParam/useLanguageParam';
import { useLanguageQuery } from '@/hooks/useLanguageQuery';
import { useUISchemasQuery } from '@/hooks/useUISchemasQuery';
import { DropdownInput } from '@ballerine/ui';

const countryCodeToLanguage = {
  en: 'English',
  cn: '中国人',
} as const;

export const LanguagePicker = () => {
  const { mutate: updateLanguage } = useLanguageQuery();
  const { language, setLanguage } = useLanguageParam();
  const { data, isLoading } = useUISchemasQuery(language);

  const { config } = data || {};

  const supportedLanguages = useMemo(
    () =>
      ((config?.supportedLanguages as string[]) ?? ['en']).map(lang => ({
        label: countryCodeToLanguage[lang as keyof typeof countryCodeToLanguage] ?? lang,
        value: lang,
      })),
    [config?.supportedLanguages],
  );

  if (isLoading) {
    return <LoadingSpinner size="14" />;
  }

  return (
    <DropdownInput
      value={language}
      name="languagePicker"
      options={supportedLanguages}
      props={{
        item: { variant: 'inverted' },
        content: { className: 'w-[204px] p-1', align: 'start' },
        trigger: {
          icon: (
            <span className="!text-primary-foreground">
              <GlobeIcon />
            </span>
          ),
          className: 'px-3 gap-x-2 text-primary-foreground bg-primary',
        },
      }}
      onChange={selectedLanguage => {
        updateLanguage(selectedLanguage);
        i18next.changeLanguage(selectedLanguage);
        setLanguage(selectedLanguage);
      }}
    />
  );
};

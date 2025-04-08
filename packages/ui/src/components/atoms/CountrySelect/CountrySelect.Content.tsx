import { ReactNode } from 'react';
import { ComponentProps } from 'react';
import { getCountries } from '@ballerine/common';
import { SelectContent } from '../Select';
import { useMemo } from 'react';

export const CountrySelectContent = ({
  locale,
  children,
  ...props
}: Omit<ComponentProps<typeof SelectContent>, 'children'> & {
  locale: string;
  children: (country: ReturnType<typeof getCountries>[number]) => ReactNode;
}) => {
  const countries = useMemo(() => getCountries(locale), [locale]);

  return <SelectContent {...props}>{countries.map(country => children(country))}</SelectContent>;
};

CountrySelectContent.displayName = 'CountrySelectContent';

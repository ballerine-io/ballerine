import { tw } from '@/theme';
import { AnyChildren } from '@ballerine/ui';
import { Page } from '@react-pdf/renderer';
import { FunctionComponent } from 'react';

export interface SectionPageProps {
  children: AnyChildren;
}

export const SectionPage: FunctionComponent<SectionPageProps> = ({ children }) => {
  return <Page style={tw('p-7 font-inter flex flex-col gap-8')}>{children}</Page>;
};

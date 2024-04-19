import { tw } from '@ballerine/react-pdf-toolkit';
import { AnyChildren } from '@ballerine/ui';
import { View } from '@react-pdf/renderer';
import { FunctionComponent } from 'react';

interface ICaseInformationPageSectionProps {
  children: AnyChildren;
}

export const CaseInformationPageSection: FunctionComponent<ICaseInformationPageSectionProps> = ({
  children,
}) => <View style={tw('flex flex-col p-6 rounded-[6px] border border-[#E5E7EB]')}>{children}</View>;

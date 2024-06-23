import { FunctionComponentWithChildren } from '@/common/types';
import { tw } from '@ballerine/react-pdf-toolkit';
import { View } from '@react-pdf/renderer';

export const CaseInformationPageSection: FunctionComponentWithChildren = ({ children }) => (
  <View style={tw('flex flex-col p-6 rounded-[6px] border border-[#E5E7EB]')}>{children}</View>
);

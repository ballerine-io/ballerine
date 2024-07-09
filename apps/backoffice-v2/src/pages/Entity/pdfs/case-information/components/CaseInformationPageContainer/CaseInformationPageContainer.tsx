import { FunctionComponentWithChildren } from '@/common/types';
import { tw } from '@ballerine/react-pdf-toolkit';
import { Page, View } from '@react-pdf/renderer';

export const CaseInformationPageContainer: FunctionComponentWithChildren = ({ children }) => (
  <Page wrap={false}>
    <View style={tw('flex flex-col p-5')}>{children}</View>
  </Page>
);

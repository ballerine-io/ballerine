import { tw } from '@ballerine/react-pdf-toolkit';
import { AnyChildren } from '@ballerine/ui';
import { Page, View } from '@react-pdf/renderer';
import { FunctionComponent } from 'react';

interface ICaseInformationPageContainer {
  children: AnyChildren;
}

export const CaseInformationPageContainer: FunctionComponent<ICaseInformationPageContainer> = ({
  children,
}) => (
  <Page wrap={false}>
    <View style={tw('flex flex-col p-5')}>{children}</View>
  </Page>
);

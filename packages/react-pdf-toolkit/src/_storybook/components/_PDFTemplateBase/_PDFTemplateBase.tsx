import { ViewerDEV } from '@/components/misc/ViewerDEV';
import { AnyChildren } from '@ballerine/ui';
import { Document } from '@react-pdf/renderer';

export const _PDFTemplateBase = ({ children }: { children: AnyChildren }) => {
  return (
    <div style={{ height: '100vh' }}>
      <ViewerDEV>
        <Document>{children}</Document>
      </ViewerDEV>
    </div>
  );
};

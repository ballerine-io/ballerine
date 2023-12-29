import { Header } from '@/templates/report/components/Header';
import { SectionPage } from '@/templates/report/components/SectionPage';
import { IReport } from '@/templates/report/schema';
import { EcosystemChecks } from '@/templates/report/sections/EcosystemChecks';
import { SummarySection } from '@/templates/report/sections/Summary/Summary';
import { WebsiteCheck } from '@/templates/report/sections/WebsiteCheck';
import { Document } from '@react-pdf/renderer';

export const ReportTemplate = ({ report }: { report: IReport }) => (
  <Document pageLayout="singlePage">
    <SectionPage>
      <Header title={`Veaiio.com TL Report`} status="published" />
      {report.summary && <SummarySection data={report.summary} />}
    </SectionPage>
    <SectionPage>
      {report.websiteChecks && <WebsiteCheck data={report.websiteChecks} />}
    </SectionPage>
    <SectionPage>
      {report.ecosystemChecks && <EcosystemChecks data={report.ecosystemChecks} />}
    </SectionPage>
  </Document>
);

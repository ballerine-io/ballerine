import { Header } from '@/templates/report/components/Header';
import { SectionPage } from '@/templates/report/components/SectionPage';
import { IReport } from '@/templates/report/schema';
import { EcosystemChecks } from '@/templates/report/sections/EcosystemChecks';
import { LineOfBusinessSection } from '@/templates/report/sections/LineOfBusiness';
import { PricingSection } from '@/templates/report/sections/Pricing';
import { ReputationSection } from '@/templates/report/sections/Reputation';
import { StructureSection } from '@/templates/report/sections/Structure';
import { SummarySection } from '@/templates/report/sections/Summary/Summary';
import { TrafficSection } from '@/templates/report/sections/Traffic';
import { WebsiteCheck } from '@/templates/report/sections/WebsiteCheck';
import { canRenderSection } from '@/templates/report/utils/canRenderSection';
import { Document } from '@react-pdf/renderer';
import { FunctionComponent } from 'react';

export interface ReportTemplateProps {
  report: IReport;
  version?: number;
}

export const ReportTemplate: FunctionComponent<ReportTemplateProps> = ({ report, version }) => (
  <Document pageLayout="singlePage">
    <SectionPage>
      <Header
        title={`${report.meta.companyName || ''} TL Report`}
        status="published"
        version={version}
      />
      {canRenderSection(report.summary) && <SummarySection data={report.summary} />}
    </SectionPage>

    {canRenderSection(report.reputation) && (
      <SectionPage>
        <ReputationSection data={report.reputation} />{' '}
      </SectionPage>
    )}

    {canRenderSection(report.structure) && (
      <SectionPage>
        <StructureSection data={report.structure} />{' '}
      </SectionPage>
    )}

    {canRenderSection(report.pricing) && (
      <SectionPage>
        <PricingSection data={report.pricing} />
      </SectionPage>
    )}

    {canRenderSection(report.traffic) && (
      <SectionPage>
        <TrafficSection data={report.traffic} />
      </SectionPage>
    )}

    {canRenderSection(report.LOB) && (
      <SectionPage>
        <LineOfBusinessSection data={report.LOB} />
      </SectionPage>
    )}

    {canRenderSection(report.websiteChecks) && (
      <SectionPage>
        <WebsiteCheck data={report.websiteChecks} />{' '}
      </SectionPage>
    )}

    {canRenderSection(report.ecosystemChecks) && (
      <SectionPage>
        <EcosystemChecks data={report.ecosystemChecks} />
      </SectionPage>
    )}
  </Document>
);

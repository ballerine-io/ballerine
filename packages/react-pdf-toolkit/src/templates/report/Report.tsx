import { Header } from '@/templates/report/components/Header';
import { SectionPage } from '@/templates/report/components/SectionPage';
import { IReport, ReportSchema } from '@/templates/report/schema';
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
import { FunctionComponent, useMemo } from 'react';
import { TypeCompiler } from '@sinclair/typebox/compiler';

export interface ReportTemplateProps {
  report: IReport;
  version?: number;
}

const C = TypeCompiler.Compile(ReportSchema);

export const ReportTemplate: FunctionComponent<ReportTemplateProps> = ({ report, version }) => {
  useMemo(() => {
    const allErrors = [...C.Errors(report)];

    if (allErrors.length) {
      throw new Error(
        JSON.stringify({
          message: 'Validation failed',
          errors: allErrors.map(({ path, message }) => ({ path, message })),
        }),
      );
    }
  }, [report]);

  return (
    <Document pageLayout="singlePage">
      <SectionPage>
        <Header
          title={`${report.meta.companyName || ''} TL Report`}
          status="published"
          version={version}
        />
        {report.summary && canRenderSection(report.summary) && (
          <SummarySection data={report.summary} />
        )}
      </SectionPage>

      {report.reputation && canRenderSection(report.reputation) && (
        <SectionPage>
          <ReputationSection data={report.reputation} />{' '}
        </SectionPage>
      )}

      {report.structure && canRenderSection(report.structure) && (
        <SectionPage>
          <StructureSection data={report.structure} />{' '}
        </SectionPage>
      )}

      {report.pricing && canRenderSection(report.pricing) && (
        <SectionPage>
          <PricingSection data={report.pricing} />
        </SectionPage>
      )}

      {report.traffic && canRenderSection(report.traffic) && (
        <SectionPage>
          <TrafficSection data={report.traffic} />
        </SectionPage>
      )}

      {report.LOB && canRenderSection(report.LOB) && (
        <SectionPage>
          <LineOfBusinessSection data={report.LOB} />
        </SectionPage>
      )}

      {report.websiteChecks && canRenderSection(report.websiteChecks) && (
        <SectionPage>
          <WebsiteCheck data={report.websiteChecks} />{' '}
        </SectionPage>
      )}

      {report.ecosystemChecks && canRenderSection(report.ecosystemChecks) && (
        <SectionPage>
          <EcosystemChecks data={report.ecosystemChecks} />
        </SectionPage>
      )}
    </Document>
  );
};

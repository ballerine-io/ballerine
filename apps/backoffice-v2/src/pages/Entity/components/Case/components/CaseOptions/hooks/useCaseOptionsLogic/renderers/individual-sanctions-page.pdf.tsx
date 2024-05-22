import { amlAdapter } from '@/lib/blocks/components/AmlBlock/utils/aml-adapter';
import { IPDFRenderer } from '@/pages/Entity/components/Case/components/CaseOptions/hooks/useCaseOptionsLogic/renderers/pdf-renderer.abstract';
import {
  EmptyIndividualSanctionsPage,
  IndividualSanctionsPage,
} from '@/pages/Entity/pdfs/case-information/pages/IndividualSanctionsPage';
import {
  IndividualSanctionsSchema,
  TIndividualSanctionsData,
} from '@/pages/Entity/pdfs/case-information/pages/IndividualSanctionsPage/individual-sanctions.schema';

export class IndividualSantcionsPagePDF extends IPDFRenderer<TIndividualSanctionsData> {
  static PDF_NAME = 'individualSanctionsPage';

  async render(): Promise<JSX.Element> {
    const pdfData = await this.getData();
    this.isValid(pdfData);

    if (this.isEmpty(pdfData)) return <EmptyIndividualSanctionsPage data={pdfData} />;

    return <IndividualSanctionsPage data={pdfData} />;
  }

  async getData() {
    const pdfData: TIndividualSanctionsData = {
      companyName: this.workflow.context?.entity?.data?.companyName || '',
      creationDate: new Date(),
      logoUrl: await this.getLogoUrl(),
      items: this.extractAmlSessions().map(session => {
        const rawAml = session.result?.vendorResult?.aml || {};
        const amlData = amlAdapter(rawAml);

        return {
          checkDate: amlData.dateOfCheck ?? undefined,
          fullName: `${session.result?.childEntity?.firstName || ''} ${
            session.result?.childEntity?.lastName || ''
          }`,
          matchesCount: amlData.totalMatches,
          names: amlData.matches.map(match => match.aka).flat(0),
          warnings: amlData.matches
            .map(match =>
              match.warnings.map(
                warning =>
                  ({
                    sourceUrl: warning.source,
                    name: warning.warning,
                  } as { sourceUrl: string; name: string }),
              ),
            )
            .flat(1)
            .filter(warning => warning.name && warning.sourceUrl),
          sanctions: amlData.matches
            .map(match =>
              match.sanctions.map(
                sanction =>
                  ({
                    sourceUrl: sanction.source,
                    name: sanction.sanction,
                  } as { sourceUrl: string; name: string }),
              ),
            )
            .flat(1)
            .filter(sanction => sanction.name && sanction.sourceUrl),
          PEP: amlData.matches
            .map(match =>
              match.pep.map(
                pep =>
                  ({ sourceUrl: pep.source, name: pep.person } as {
                    sourceUrl: string;
                    name: string;
                  }),
              ),
            )
            .flat(1)
            .filter(pep => pep.name && pep.sourceUrl),
          adverseMedia: amlData.matches
            .map(match =>
              match.adverseMedia.map(
                adverseMedia =>
                  ({
                    sourceUrl: adverseMedia.source,
                    name: adverseMedia.entry,
                  } as { sourceUrl: string; name: string }),
              ),
            )
            .flat(1)
            .filter(adverseMedia => adverseMedia.name && adverseMedia.sourceUrl),
        };
      }),
    };

    return pdfData;
  }

  private extractAmlSessions() {
    const childWorkflowSessions = Object.values(this.workflow?.context?.childWorkflows || {});
    const sessions = childWorkflowSessions
      .map(childWorkflowSession => {
        return Object.values(childWorkflowSession || {});
      })
      .flat(1);

    return sessions;
  }

  isValid(data: TIndividualSanctionsData) {
    IndividualSanctionsSchema.parse(data);
  }

  private isEmpty(data: TIndividualSanctionsData) {
    return !data.items?.length;
  }
}

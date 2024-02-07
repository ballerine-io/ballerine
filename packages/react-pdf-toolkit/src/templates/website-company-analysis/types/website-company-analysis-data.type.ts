import { WebsiteCompanyAnalysisSchema } from '@/templates/website-company-analysis/schemas/website-company-analysis.schema';
import { Static } from '@sinclair/typebox';

export type WebsiteCompanyAnalysisData = Static<typeof WebsiteCompanyAnalysisSchema>;

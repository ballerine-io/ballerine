import { SocialMediaReportSchema } from '@/templates/social-media/schemas/social-media-report-schema';
import { Static } from '@sinclair/typebox';

export type SocialMediaReportData = Static<typeof SocialMediaReportSchema>;

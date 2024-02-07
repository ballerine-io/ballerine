import {
  AdsInformationSchema,
  SocialMediaReportSchema,
} from '@/templates/social-media/schemas/social-media-report-schema';
import { Static } from '@sinclair/typebox';

export type SocialMediaReportAdInformation = Static<typeof AdsInformationSchema>;
export type SocialMediaReportData = Static<typeof SocialMediaReportSchema>;

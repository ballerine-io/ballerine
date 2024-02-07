import { Type } from '@sinclair/typebox';

const AdsInformationSchema = Type.Object({
  pageInformation: Type.Object({}),
  imageUrl: Type.String({ format: 'uri' }),
  link: Type.String({ format: 'uri' }),
  pickedAd: Type.Object({
    imageUrl: Type.String({ format: 'uri' }),
    link: Type.String({ format: 'uri' }),
  }),
});

export const SocialMediaReportSchema = Type.Object({
  riskRank: Type.Number({ default: 0 }),
  riskIndicators: Type.Array(Type.String()),
  summary: Type.String({ default: '' }),
  ads: Type.Object({
    facebook: AdsInformationSchema,
    instagram: AdsInformationSchema,
  }),
  website: Type.Object({
    url: Type.String({ format: 'uri' }),
  }),
});

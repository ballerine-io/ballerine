import { Type } from '@sinclair/typebox';

export const AdsInformationSchema = Type.Object({
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
  ads: Type.Union([
    Type.Object({
      facebook: Type.Union([AdsInformationSchema, Type.Null()]),
      instagram: Type.Union([AdsInformationSchema, Type.Null()]),
    }),
    Type.Null(),
  ]),
  website: Type.Object({
    url: Type.String({ format: 'uri' }),
  }),
});

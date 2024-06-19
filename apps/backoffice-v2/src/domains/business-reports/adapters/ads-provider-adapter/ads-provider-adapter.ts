import { booleanToYesOrNo } from '@/common/utils/boolean-to-yes-or-no/boolean-to-yes-or-no';
import { TAdsProvider } from '@/domains/business-reports/types';

export const adsProviderAdapter = {
  facebook: data => ({
    page: data?.adsInformation?.link,
    id: data?.adsInformation?.id,
    creationDate: data?.adsInformation?.creationDate,
    categories: data?.adsInformation?.pageInformation?.categories,
    address: data?.adsInformation?.address,
    phoneNumber: data?.adsInformation?.phoneNumber,
    email: data?.adsInformation?.email,
    likes: data?.adsInformation?.numberOfLikes,
    followers: data?.adsInformation?.numberOfFollowers,
  }),
  instagram: data => ({
    page: data?.adsInformation?.link,
    fullName: data?.adsInformation?.pageInformation?.fullName,
    creationDate: data?.adsInformation?.creationDate,
    businessCategoryName: data?.adsInformation?.pageInformation?.businessCategoryName,
    biography: data?.adsInformation?.pageInformation?.biography,
    followers: data?.adsInformation?.numberOfFollowers,
    isBusinessAccount: booleanToYesOrNo(data?.adsInformation?.pageInformation?.isBusinessAccount),
  }),
} as const satisfies Record<
  Lowercase<TAdsProvider>,
  (data: Record<string, any>) => Record<string, unknown>
>;

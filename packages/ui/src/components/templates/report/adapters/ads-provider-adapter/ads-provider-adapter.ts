import { booleanToYesOrNo } from '@ballerine/common';
import { TAdsProvider } from '@/components/templates/report/types';

export const adsProviderAdapter = {
  facebook: data => ({
    page: data?.pageUrl,
    id: data?.id,
    creationDate: data?.creationDate,
    categories: data?.pageCategories,
    address: data?.address,
    phoneNumber: data?.phoneNumber,
    email: data?.email,
    likes: data?.numberOfLikes,
  }),
  instagram: data => ({
    page: data?.pageUrl,
    userName: data?.username,
    categories: data?.pageCategories,
    biography: data?.biography,
    followers: data?.numberOfFollowers,
    isBusinessAccount: booleanToYesOrNo(data?.isBusinessAccount),
  }),
} as const satisfies Record<
  Lowercase<TAdsProvider>,
  (data: Record<string, any>) => Record<string, unknown>
>;

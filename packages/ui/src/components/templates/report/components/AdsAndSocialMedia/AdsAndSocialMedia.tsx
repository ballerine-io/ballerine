import { ctw } from '@/common';
import { buttonVariants, Card, Image, TextWithNAFallback } from '@/components';
import {
  toAdsImages,
  toSocialMediaPresence,
} from '@/components/templates/report/adapters/report-adapter';
import { AdsProviders } from '@/components/templates/report/constants';
import {
  BanIcon,
  BriefcaseIcon,
  CalendarIcon,
  CheckIcon,
  InfoIcon,
  LinkIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  TagIcon,
  ThumbsUpIcon,
  UsersIcon,
} from 'lucide-react';
import { FunctionComponent, ReactNode } from 'react';
import { capitalize, toLowerCase } from 'string-ts';
import { z } from 'zod';
import { FacebookIcon } from './icons/FacebookIcon';
import { InstagramIcon } from './icons/InstagramIcon';
import { ContentTooltip } from '@/components/molecules/ContentTooltip/ContentTooltip';

const socialMediaMapper: {
  facebook: {
    icon: ReactNode;
    fields: Record<
      Exclude<keyof AdsAndSocialMediaProps['mediaPresence']['facebook'], 'page' | 'id'>,
      { icon: ReactNode; label: string }
    >;
  };
  instagram: {
    icon: ReactNode;
    fields: Record<
      Exclude<keyof AdsAndSocialMediaProps['mediaPresence']['instagram'], 'page' | 'userName'>,
      { icon: ReactNode; label: string }
    >;
  };
} = {
  facebook: {
    icon: <FacebookIcon className="h-8 w-8" />,
    fields: {
      creationDate: {
        icon: <CalendarIcon className="h-5 w-5 text-gray-500" />,
        label: 'Creation Date',
      },
      phoneNumber: { icon: <PhoneIcon className="h-5 w-5 text-gray-500" />, label: 'Phone Number' },
      email: { icon: <MailIcon className="h-5 w-5 text-gray-500" />, label: 'Email' },
      address: { icon: <MapPinIcon className="h-5 w-5 text-gray-500" />, label: 'Address' },
      likes: { icon: <ThumbsUpIcon className="h-5 w-5 text-gray-500" />, label: 'Likes' },
      categories: { icon: <TagIcon className="h-5 w-5 text-gray-500" />, label: 'Categories' },
    },
  },
  instagram: {
    icon: <InstagramIcon className="h-8 w-8" />,
    fields: {
      isBusinessAccount: {
        icon: <BriefcaseIcon className="h-5 w-5 text-gray-500" />,
        label: 'Business Profile',
      },
      isVerified: { icon: <CheckIcon className="h-5 w-5 text-gray-500" />, label: 'Verified' },
      followers: { icon: <UsersIcon className="h-5 w-5 text-gray-500" />, label: 'Followers' },
      categories: {
        icon: <TagIcon className="h-5 w-5 text-gray-500" />,
        label: 'Categories',
      },
      biography: { icon: <InfoIcon className="h-5 w-5 text-gray-500" />, label: 'Biography' },
    },
  },
} as const;

const cleanLink = (link: string) => {
  if (!link || !z.string().url().safeParse(link).success) {
    return 'N/A';
  }

  const { hostname, pathname } = new URL(link);

  return `${hostname.startsWith('www.') ? hostname.slice(4) : hostname}${pathname}`;
};

// TODO: this component can be further decoupled to re-use for social media data and ads data.
// Also empty state can be decoupled.
type AdsAndSocialMediaProps = {
  mediaPresence: ReturnType<typeof toSocialMediaPresence>;
  adsImages: ReturnType<typeof toAdsImages>;

  violations?: Array<{ label: string; severity: string }>;
  relatedAdsSummary?: string;
  relatedAdsImages?: Array<{ src: string; link: string }>;
};
export const AdsAndSocialMedia: FunctionComponent<AdsAndSocialMediaProps> = ({
  mediaPresence,
  adsImages,
  relatedAdsImages,
}) => (
  <div className="space-y-6 px-4">
    <div>
      <ContentTooltip
        description={<p>Reviews the merchant&apos;s social media presence.</p>}
        props={{
          tooltipContent: {
            align: 'center',
          },
        }}
      >
        <h2 className="text-lg font-bold">Social Media Analysis</h2>
      </ContentTooltip>
    </div>

    <div>
      <h3 className="mb-2 text-base font-bold">Social Media</h3>

      <div className="flex w-full flex-col gap-4">
        {AdsProviders.map(toLowerCase).map(provider => {
          const { page, ...rest } = mediaPresence[provider] ?? {};
          const { src, link } = adsImages[provider] ?? {};

          // || because empty string is not a valid case
          const idValue = ('id' in rest ? rest.id : rest.userName) || null;

          return (
            <Card key={provider} className={ctw('shadow-l w-full p-4', !page && 'opacity-60')}>
              <div className="flex flex-row items-center gap-2 font-semibold">
                {socialMediaMapper[provider].icon}
                <h4 className="text-xl">{capitalize(provider)}</h4>
              </div>

              {page ? (
                <div className="flex justify-between gap-4">
                  <div className="w-2/3 min-w-0 grow-0">
                    <div className="flex items-center">
                      <LinkIcon className="h-5 w-5 text-gray-400" />
                      <a
                        className={ctw(
                          buttonVariants({ variant: 'browserLink' }),
                          'ml-2 p-0 text-base',
                        )}
                        href={link}
                      >
                        {cleanLink(link)}
                      </a>
                    </div>
                    {idValue !== null && (
                      <span className="text-sm text-gray-400">
                        {'id' in rest ? `ID ${idValue}` : `@${idValue}`}
                      </span>
                    )}

                    <div className="mt-8 flex gap-6">
                      <div className="flex flex-col gap-4">
                        {Object.entries(socialMediaMapper[provider].fields).map(
                          ([, { icon, label }]) => (
                            <div key={label} className="flex items-center gap-4 whitespace-nowrap">
                              {icon}
                              <span className="font-semibold">{label}</span>
                            </div>
                          ),
                        )}
                      </div>

                      <div className="flex min-w-0 flex-col gap-4">
                        {Object.entries(socialMediaMapper[provider].fields).map(
                          ([field, { label }]) => {
                            const value = rest[field as keyof typeof rest];

                            return (
                              <TextWithNAFallback
                                key={label}
                                className={ctw(
                                  'max-w-full overflow-hidden text-ellipsis',
                                  !value && 'text-gray-400',
                                  label !== 'Biography' && 'whitespace-nowrap',
                                )}
                              >
                                {value}
                              </TextWithNAFallback>
                            );
                          },
                        )}
                      </div>
                    </div>
                  </div>

                  <a
                    className={buttonVariants({
                      variant: 'link',
                      className:
                        'h-[unset] w-1/3 cursor-pointer !p-0 !text-[#14203D] underline decoration-[1.5px]',
                    })}
                    href={link}
                  >
                    <Image
                      key={src}
                      src={src}
                      alt={`${capitalize(provider)} image`}
                      role="link"
                      className="h-auto max-h-96 w-auto"
                    />
                  </a>
                </div>
              ) : (
                <div className="my-4 flex items-center gap-2 text-gray-400">
                  <BanIcon className="h-5 w-5" />
                  <span className="text-sm">No {capitalize(provider)} profile detected.</span>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>

    {/* <div>
      <h3 className="mb-2 text-base font-bold">Ads</h3>
      <Card
        className={ctw(
          'flex w-full justify-between p-4 shadow-lg',
          relatedAdsImages && relatedAdsImages.length > 0 ? 'opacity-100' : 'opacity-60',
        )}
      >
        {relatedAdsImages ? (
          <>The ads should be displayed here</>
        ) : (
          <div className="flex items-center gap-2 text-gray-400">
            <BanIcon className="h-5 w-5" />
            <span className="text-sm">No ads detected.</span>
          </div>
        )}
      </Card>
    </div> */}
  </div>
);

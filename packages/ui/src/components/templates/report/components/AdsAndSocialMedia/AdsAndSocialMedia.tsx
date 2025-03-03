import { FacebookPageSchema, InstagramPageSchema } from '@ballerine/common';
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
import { ReactNode } from 'react';
import { capitalize } from 'string-ts';
import { z } from 'zod';

import { ctw } from '@/common';
import { buttonVariants, Card, Image, TextWithNAFallback } from '@/components';
import { AdsProviders } from '@/components/templates/report/constants';
import { FacebookIcon } from './icons/FacebookIcon';
import { InstagramIcon } from './icons/InstagramIcon';

const socialMediaMapper: {
  facebook: {
    icon: ReactNode;
    fields: Partial<
      Record<
        keyof z.infer<typeof FacebookPageSchema>,
        { icon: ReactNode; label: string; toDisplay?: (value: unknown) => string }
      >
    >;
  };
  instagram: {
    icon: ReactNode;
    fields: Partial<
      Record<
        keyof z.infer<typeof InstagramPageSchema>,
        { icon: ReactNode; label: string; toDisplay?: (value: unknown) => string }
      >
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
      isBusinessProfile: {
        icon: <BriefcaseIcon className="h-5 w-5 text-gray-500" />,
        label: 'Business Profile',
        toDisplay: value => {
          if (typeof value !== 'boolean') {
            return 'N/A';
          }

          return value ? 'Yes' : 'No';
        },
      },
      isVerified: {
        icon: <CheckIcon className="h-5 w-5 text-gray-500" />,
        label: 'Verified',
        toDisplay: value => {
          if (typeof value !== 'boolean') {
            return 'N/A';
          }

          return value ? 'Yes' : 'No';
        },
      },
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

export const AdsAndSocialMedia = (pages: {
  facebook: z.infer<typeof FacebookPageSchema> | null;
  instagram: z.infer<typeof InstagramPageSchema> | null;
}) => {
  return (
    <div className="flex w-full flex-col gap-4">
      {AdsProviders.map(provider => {
        const page = pages[provider];

        if (!page) {
          return (
            <Card key={provider} className={ctw('shadow-l w-full p-4 opacity-60')}>
              <div className="flex flex-row items-center gap-2 font-semibold">
                {socialMediaMapper[provider].icon}
                <h4 className="text-xl">{capitalize(provider)}</h4>
              </div>
              <div className="my-4 flex items-center gap-2 text-gray-400">
                <BanIcon className="h-5 w-5" />
                <span className="text-sm">No {capitalize(provider)} profile detected.</span>
              </div>
            </Card>
          );
        }

        const { screenshotUrl, url, ...rest } = page;

        const idValue = 'username' in rest ? rest.username : rest.id;

        return (
          <Card key={provider} className={ctw('shadow-l w-full p-4')}>
            <div className="flex flex-row items-center gap-2 font-semibold">
              {socialMediaMapper[provider].icon}
              <h4 className="text-xl">{capitalize(provider)}</h4>
            </div>

            <div className="flex justify-between gap-4">
              <div className="w-2/3 min-w-0 grow-0">
                <div className="flex items-center">
                  <LinkIcon className="h-5 w-5 text-gray-400" />
                  <a
                    className={ctw(
                      buttonVariants({ variant: 'browserLink' }),
                      'ml-2 p-0 text-base',
                    )}
                    href={url}
                  >
                    {cleanLink(url)}
                  </a>
                </div>
                {idValue !== null && (
                  <span className="text-sm text-gray-400">
                    {'username' in rest ? `@${idValue}` : `ID ${idValue}`}
                  </span>
                )}

                <div className="mt-8 flex gap-6">
                  <div className="flex flex-col gap-4">
                    {Object.entries(socialMediaMapper[provider].fields).map(
                      ([field, { icon, label, toDisplay }]) => {
                        const value = rest[field as keyof typeof rest];

                        return (
                          <div key={label} className="flex items-center gap-4">
                            <div className="flex w-[15ch] items-center gap-4 whitespace-nowrap">
                              {icon}
                              <span className="font-semibold">{label}</span>
                            </div>
                            <TextWithNAFallback
                              key={label}
                              className={ctw('max-w-[50ch] break-words', {
                                'text-gray-400': !value,
                              })}
                            >
                              {toDisplay?.(value) ?? value}
                            </TextWithNAFallback>
                          </div>
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
                href={url}
              >
                {screenshotUrl && (
                  <Image
                    key={screenshotUrl}
                    src={screenshotUrl}
                    alt={`${capitalize(provider)} image`}
                    role="link"
                    className="h-auto max-h-96 w-auto"
                  />
                )}
              </a>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

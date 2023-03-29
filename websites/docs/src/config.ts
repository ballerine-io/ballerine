import type { TTab } from './types';

export const SITE = {
  title: `Ballerine Documentation`,
  description: `Your website description.`,
  defaultLanguage: `en_US`,
};

export const OPEN_GRAPH = {
  image: {
    // Provide a banner url for the open graph image.
    src: `/logo.png`,
    alt: `Ballerine's logo, a pink letter "B" with a stylized font.`,
  },
  twitter: `astrodotbuild`,
};

// This is the type of the frontmatter you put in the docs markdown files.
export interface Frontmatter {
  title: string;
  description: string;
  layout: string;
  image?: { src: string; alt: string };
  dir?: `ltr` | `rtl`;
  ogLocale?: string;
  lang?: string;
}

export const KNOWN_LANGUAGES = {
  English: `en`,
} as const;
export const KNOWN_LANGUAGE_CODES = Object.values(KNOWN_LANGUAGES);

export const GITHUB_EDIT_URL = `https://github.com/ballerine-io/ballerine/tree/main/examples/docs`;

export const DISCORD_URL = `https://discord.gg/e2rQE4YygA`;

export const SLACK_URL = `https://join.slack.com/t/ballerine-oss/shared_invite/zt-1iu6otkok-OqBF3TrcpUmFd9oUjNs2iw`;

export const GITHUB_REPO_URL = `https://github.com/ballerine-io/ballerine/`;

export const TWITTER_URL = `https://twitter.com/ballerine_io`;

export const EMAIL_ADDRESS = `oss@ballerine.io`;

// See "Algolia" section of the README for more information.
export const ALGOLIA = {
  indexName: `XXXXXXXXXX`,
  appId: `XXXXXXXXXX`,
  apiKey: `XXXXXXXXXX`,
};

export type Sidebar = Record<
  (typeof KNOWN_LANGUAGE_CODES)[number],
  Record<
    TTab,
    Array<{
      group: string;
      sections: Array<{ text: string; link: string; external?: boolean }>;
    }>
  >
>;
export const SIDEBAR: Sidebar = {
  en: {
    learn: [
      {
        group: `Getting started`,
        sections: [{ text: `UI Flows`, link: `ui-flows` }],
      },
      {
        group: `Start Here`,
        sections: [
          { text: `Introduction`, link: `introduction` },
          {
            text: `Style Guidelines`,
            link: `style-guidelines`,
          },
          { text: `Contributing`, link: `contributing` },
        ],
      },
      {
        group: `Basics`,
        sections: [
          { text: `SDK Events`, link: `sdk-events` },
          { text: `SDK Backend Configuration`, link: `sdk-backend-configuration` },
          { text: `SDK UI Configuration`, link: `sdk-ui-configuration` },
          { text: `SDK Translations`, link: `sdk-translations` },
          { text: `Case Management`, link: `case-management` },
          { text: `SDK UI Flows`, link: `sdk-ui-flows` },
          {
            text: `Workflow Builder & Rule Engine`,
            link: `workflow-builder-and-rule-engine`,
          },
          {
            text: `Native Mobile Apps`,
            link: `native-mobile-apps`,
          },
        ],
      },
      {
        group: `Guides`,
        sections: [
          {
            text: `Creating a KYC flow and deploying it`,
            link: `creating-a-kyc-flow-and-deploying-it`,
          },
        ],
      },
      {
        group: `Examples`,
        sections: [
          {
            text: `KYC`,
            link: `kyc-example`,
          },
          {
            text: `KYB`,
            link: `kyb-example`,
          },
          {
            text: `Kitchen Sink`,
            link: `kitchen-sink-example`,
          },
          {
            text: `Package Manager`,
            link: `package-manager-example`,
          },
          {
            text: `CDN`,
            link: `cdn-example`,
          },
          {
            text: `Hosted KYC`,
            link: `https://simple-kyc-demo.ballerine.app/`,
            external: true,
          },
        ],
      },
    ],
    api: [
      {
        group: `SDK`,
        sections: [
          {
            text: `Flows`,
            link: `sdk/ballerine-sdk-flows`,
          },
        ],
      },
      {
        group: `Interfaces`,
        sections: [
          {
            text: `FlowsInitOptions`,
            link: `sdk/flows-init-options`,
          },
          {
            text: `FlowsBackendConfig`,
            link: `sdk/flows-backend-config`,
          },
          {
            text: `FlowsMountOptions`,
            link: `sdk/flows-mount-options`,
          },
          {
            text: `FlowsEventsConfig`,
            link: `sdk/flows-events-config`,
          },
          {
            text: `EndUserInfo`,
            link: `sdk/end-user-info`,
          },
          {
            text: `FlowsTranslations`,
            link: `sdk/flows-translations`,
          },
        ],
      },
    ],
  },
};

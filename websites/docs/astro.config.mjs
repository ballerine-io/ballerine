import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: `Ballerine Documentation`,
      logo: {
        dark: `/src/assets/ballerine-logo-dark.svg`,
        light: `/src/assets/ballerine-logo-light.svg`,
      },
      description: `Ballerine is an open-source user risk decisioning infrastructure that helps companies automate their decisions for customer and business account-opening (KYC, KYB), underwriting, and transaction monitoring, using a flexible rules & workflow engine, 3rd party plugin system, manual review back office, and document & information collection frontend flows.`,
      locales: {
        en: {
          label: `English`,
          lang: `en`,
        },
      },
      social: {
        github: `https://github.com/ballerine-io/ballerine/`,
        discord: `https://discord.gg/e2rQE4YygA`,
        twitter: `https://twitter.com/ballerine_io`,
      },
      editLink: {
        baseUrl: `https://github.com/ballerine-io/ballerine/tree/dev/websites/docs`,
      },
      sidebar: [
        {
          label: `Getting started`,
          items: [
            {
              label: `Introduction`,
              link: `/en/getting_started/introduction`,
            },
            {
              label: `Glossary`,
              link: `/en/getting_started/glossary`,
            },
            {
              label: `Installation`,
              link: `/en/getting_started/installation`,
            },
            {
              label: `Deployment`,
              link: `/en/getting_started/deployment`,
            },
          ],
        },
        {
          label: 'Learn',
          collapsed: false,
          items: [
            {
              label: `Guides`,
              items: [
                {
                  label: `KYB Manual Review Example`,
                  link: `/en/learn/kyb_manual_review_example`,
                },
                {
                  label: `KYC Manual Review Example`,
                  link: `/en/learn/kyc_manual_review_example`,
                },
                {
                  label: `KYB Workflow with External Integrations`,
                  link: `/en/learn/simple_kyb_guide`,
                },
                {
                  label: `KYC Manual Review Workflow Guide`,
                  link: `/en/learn/kyc_manual_review_workflow_guide`,
                },
                {
                  label: `Creating a KYC UI Flow`,
                  link: `/en/learn/creating_a_kyc_flow_and_deploying_it`,
                },
              ],
            },
            {
              label: `Workflows`,
              items: [
                {
                  label: `Understanding Workflows`,
                  link: `/en/learn/understanding_workflows`,
                },
                {
                  label: `Workflow Definitions`,
                  link: `/en/learn/workflow_definitions`,
                },
                {
                  label: `Interacting with Workflows`,
                  link: `/en/learn/interacting_with_workflows`,
                },
                {
                  label: `Workflows Plugins`,
                  link: `/en/learn/plugins`,
                },
              ],
            },
            // {
            //   label: `Case Management`,
            //   items: [],
            // },
            {
              label: 'KYB Collection Flow',
              collapsed: false,
              items: [
                {
                  label: 'Introduction',
                  link: '/en/collection-flow/introduction',
                },
                {
                  label: 'Schema Breakdown',
                  link: '/en/collection-flow/schema-breakdown',
                },
                {
                  label: 'UI Elements',
                  items: [
                    {
                      label: 'Overview',
                      link: '/en/collection-flow/ui-elements',
                    },
                    {
                      label: 'JSONForm',
                      link: '/en/collection-flow/json-form',
                    },
                  ],
                },
                {
                  label: 'Customization',
                  items: [
                    {
                      label: 'Theming',
                      link: '/en/collection-flow/theming',
                    },
                  ],
                },
                {
                  label: 'API',
                  items: [
                    {
                      label: 'UI Definition updating',
                      link: '/en/collection-flow/ui-definition-updating',
                    },
                  ],
                },
                {
                  label: 'Integrations',
                  items: [
                    {
                      label: 'iFrame',
                      link: '/en/collection-flow/iframe',
                    },
                  ],
                },
              ],
            },
            {
              label: `Case Management`,
              items: [
                {
                  label: `Overview`,
                  link: `/en/learn/case_management_overview`,
                },
              ],
            },
            // {
            //   label: `Workflow Builder & Rule Engine`,
            //   items: [
            //     {
            //       label: `Overview`,
            //       link: `/en/learn/workflow_builder_and_rule_engine_overview`,
            //     },
            //   ],
            // },
            {
              label: `UI SDK`,
              items: [
                {
                  label: `SDK Events`,
                  link: `/en/learn/sdk_events`,
                },
                {
                  label: `SDK Backend Configuration`,
                  link: `/en/learn/sdk_backend_configuration`,
                },
                {
                  label: `SDK UI Configuration`,
                  link: `/en/learn/sdk_ui_configuration`,
                },
                {
                  label: `SDK Translations`,
                  link: `/en/learn/sdk_translations`,
                },
                {
                  label: `SDK UI Flows`,
                  link: `/en/learn/sdk_ui_flows`,
                },
                {
                  label: `Native Mobile Apps`,
                  link: `/en/learn/native_mobile_apps`,
                },
              ],
            },
          ],
        },
        // {
        //   label: `API`,
        //   collapsed: true,
        //   items: [
        //     {
        //       label: `SDK`,
        //       items: [
        //         {
        //           label: `Flows`,
        //           link: `/en/api/sdk/ballerine_sdk_flows`,
        //         },
        //       ],
        //     },
        //     {
        //       label: `Interfaces`,
        //       items: [
        //         {
        //           label: `FlowsInitOptions`,
        //           link: `/en/api/sdk/flows_init_options`,
        //         },
        //         {
        //           label: `FlowsBackendConfig`,
        //           link: `/en/api/sdk/flows_backend_config`,
        //         },
        //         {
        //           label: `FlowsMountOptions`,
        //           link: `/en/api/sdk/flows_mount_options`,
        //         },
        //         {
        //           label: `FlowsEventsConfig`,
        //           link: `/en/api/sdk/flows_events_config`,
        //         },
        //         {
        //           label: `EndUserInfo`,
        //           link: `/en/api/sdk/end_user_info`,
        //         },
        //         {
        //           label: `FlowsTranslations`,
        //           link: `/en/api/sdk/flows_translations`,
        //         },
        //       ],
        //     },
        //   ],
        // },
        // {
        //   label: `Examples`,
        //   collapsed: true,
        //   items: [
        //     {
        //       label: `KYC`,
        //       link: `/en/examples/kyc_example`,
        //     },
        //     {
        //       label: `KYB`,
        //       link: `/en/examples/kyb_example`,
        //     },
        //     {
        //       label: `Kitchen Sink`,
        //       link: `/en/examples/kitchen_sink_example`,
        //     },
        //     {
        //       label: `Package Manager`,
        //       link: `/en/examples/package_manager_example`,
        //     },
        //     {
        //       label: `CDN`,
        //       link: `/en/examples/cdn_example`,
        //     },
        //     {
        //       label: `Hosted KYC`,
        //       link: `https://simple-kyc-demo.ballerine.app/`,
        //     },
        //   ],
        // },
        {
          label: `Contributing`,
          collapsed: true,
          items: [
            {
              label: `Style Guidelines`,
              link: `/en/style_guidelines`,
            },
            {
              label: `Contributing`,
              link: `/en/contributing`,
            },
          ],
        },
      ],
      customCss: [`/src/styles/custom.css`],
    }),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  // Process images with sharp: https://docs.astro.build/en/guides/assets/#using-sharp
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
  redirects: {
    '/': '/en/getting_started/introduction/',
    '/en': '/en/getting_started/introduction/',
  },
});

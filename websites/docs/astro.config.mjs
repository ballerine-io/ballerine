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
              label: `System Overview`,
              link: `/en/getting_started/system_overview`,
            },
            {
              label: `Glossary`,
              link: `/en/getting_started/glossary`,
            },
            {
              label: `Installation`,
              link: `/en/getting_started/installation`,
            },
          ],
        },
        {
          label: `Deployment`,
          collapsed: true,
          items: [
            {
              label: `Docker Compose`,
              link: `/en/deployment/docker_compose`,
            },
            {
              label: `Ansible `,
              link: `/en/deployment/ansible_deployment`,
            },
          ],
        },
        {
          label: 'Learn',
          collapsed: false,
          items: [
            {
              label: `Workflows`,
              collapsed: true,
              items: [
                {
                  label: `Understanding workflows technology`,
                  link: `/en/learn/workflows_technology`,
                },
                {
                  label: `Creating a workflow`,
                  link: `/en/learn/creating_a_workflow`,
                },
                {
                  label: `Configuring a workflow`,
                  link: `/en/learn/configuring_a_workflow`,
                },
                {
                  label: `Invoking a workflow / case`,
                  link: `/en/learn/invoking_a_workflow`,
                },
              ],
            },
            {
              label: `Collection Flows`,
              collapsed: true,
              items: [
                // {
                //   label: `Creating a collection flow`,
                //   link: `/en/learn/creating_a_collection_flow`,
                // },
                {
                  label: `Configuring a collection flow`,
                  link: `/en/learn/configuring_a_collection_flow`,
                },
                // {
                //   label: `Changing the collection flow design`,
                //   link: `/en/learn/changing_the_collection_flow_design`,
                // },
                {
                  label: 'Theming',
                  link: '/en/collection-flow/theming',
                },
                {
                  label: 'Implementing in an iFrame',
                  link: '/en/collection-flow/iframe',
                },
              ],
            },
            {
              label: `Rule Engine`,
              collapsed: true,
              items: [
                {
                  label: `Making a rule affect a workflow state`,
                  link: `/en/learn/adding_rules_and_affect_workflows`,
                },
                {
                  label: `Calculation Risk Scores`,
                  link: `/en/learn/calculating_risk_scores`,
                },
              ],
            },
            {
              label: `Case Management`,
              collapsed: true,
              items: [
                {
                  label: `Overview of case management`,
                  link: `/en/learn/case_management_overview`,
                },
                {
                  label: `Using the case management dashboard`,
                  link: `/en/learn/using_the_case_management_dashboard`,
                },
                {
                  label: `Add and Customize Workflows in the Case Management`,
                  link: `/en/learn/add_and_customize_workflows_in_the_case_management`,
                },
              ],
            },
            {
              label: `Unified API`,
              collapsed: true,
              items: [
                {
                  label: `Adding a 3rd Party check to a workflow`,
                  link: `/en/learn/adding_a_3rd_party_check_to_a_workflow`,
                },
              ],
            },
            {
              label: `Plugins`,
              collapsed: true,
              items: [
                {
                  label: `Using Plugins`,
                  link: `/en/learn/plugins`,
                },
              ],
            },
            {
              label: `Webhooks`,
              collapsed: true,
              items: [
                {
                  label: `Using webhooks`,
                  link: `/en/learn/how_to_use_webhooks`,
                },
              ],
            },
            {
              label: `KYC Collection Flow (SDK)`,
              collapsed: true,
              items: [
                {
                  label: 'Introduction',
                  link: '/en/learn/introduction',
                },
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

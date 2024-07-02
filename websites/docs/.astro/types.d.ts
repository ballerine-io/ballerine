declare module 'astro:content' {
  interface Render {
    '.mdx': Promise<{
      Content: import('astro').MarkdownInstance<{}>['Content'];
      headings: import('astro').MarkdownHeading[];
      remarkPluginFrontmatter: Record<string, any>;
    }>;
  }
}

declare module 'astro:content' {
  interface Render {
    '.md': Promise<{
      Content: import('astro').MarkdownInstance<{}>['Content'];
      headings: import('astro').MarkdownHeading[];
      remarkPluginFrontmatter: Record<string, any>;
    }>;
  }
}

declare module 'astro:content' {
  export { z } from 'astro/zod';

  type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

  export type CollectionKey = keyof AnyEntryMap;
  export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

  export type ContentCollectionKey = keyof ContentEntryMap;
  export type DataCollectionKey = keyof DataEntryMap;

  // This needs to be in sync with ImageMetadata
  export type ImageFunction = () => import('astro/zod').ZodObject<{
    src: import('astro/zod').ZodString;
    width: import('astro/zod').ZodNumber;
    height: import('astro/zod').ZodNumber;
    format: import('astro/zod').ZodUnion<
      [
        import('astro/zod').ZodLiteral<'png'>,
        import('astro/zod').ZodLiteral<'jpg'>,
        import('astro/zod').ZodLiteral<'jpeg'>,
        import('astro/zod').ZodLiteral<'tiff'>,
        import('astro/zod').ZodLiteral<'webp'>,
        import('astro/zod').ZodLiteral<'gif'>,
        import('astro/zod').ZodLiteral<'svg'>,
        import('astro/zod').ZodLiteral<'avif'>,
      ]
    >;
  }>;

  type BaseSchemaWithoutEffects =
    | import('astro/zod').AnyZodObject
    | import('astro/zod').ZodUnion<[BaseSchemaWithoutEffects, ...BaseSchemaWithoutEffects[]]>
    | import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
    | import('astro/zod').ZodIntersection<BaseSchemaWithoutEffects, BaseSchemaWithoutEffects>;

  type BaseSchema =
    | BaseSchemaWithoutEffects
    | import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

  export type SchemaContext = { image: ImageFunction };

  type DataCollectionConfig<S extends BaseSchema> = {
    type: 'data';
    schema?: S | ((context: SchemaContext) => S);
  };

  type ContentCollectionConfig<S extends BaseSchema> = {
    type?: 'content';
    schema?: S | ((context: SchemaContext) => S);
  };

  type CollectionConfig<S> = ContentCollectionConfig<S> | DataCollectionConfig<S>;

  export function defineCollection<S extends BaseSchema>(
    input: CollectionConfig<S>,
  ): CollectionConfig<S>;

  type AllValuesOf<T> = T extends any ? T[keyof T] : never;
  type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
    ContentEntryMap[C]
  >['slug'];

  export function getEntryBySlug<
    C extends keyof ContentEntryMap,
    E extends ValidContentEntrySlug<C> | (string & {}),
  >(
    collection: C,
    // Note that this has to accept a regular string too, for SSR
    entrySlug: E,
  ): E extends ValidContentEntrySlug<C>
    ? Promise<CollectionEntry<C>>
    : Promise<CollectionEntry<C> | undefined>;

  export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
    collection: C,
    entryId: E,
  ): Promise<CollectionEntry<C>>;

  export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
    collection: C,
    filter?: (entry: CollectionEntry<C>) => entry is E,
  ): Promise<E[]>;
  export function getCollection<C extends keyof AnyEntryMap>(
    collection: C,
    filter?: (entry: CollectionEntry<C>) => unknown,
  ): Promise<CollectionEntry<C>[]>;

  export function getEntry<
    C extends keyof ContentEntryMap,
    E extends ValidContentEntrySlug<C> | (string & {}),
  >(entry: {
    collection: C;
    slug: E;
  }): E extends ValidContentEntrySlug<C>
    ? Promise<CollectionEntry<C>>
    : Promise<CollectionEntry<C> | undefined>;
  export function getEntry<
    C extends keyof DataEntryMap,
    E extends keyof DataEntryMap[C] | (string & {}),
  >(entry: {
    collection: C;
    id: E;
  }): E extends keyof DataEntryMap[C]
    ? Promise<DataEntryMap[C][E]>
    : Promise<CollectionEntry<C> | undefined>;
  export function getEntry<
    C extends keyof ContentEntryMap,
    E extends ValidContentEntrySlug<C> | (string & {}),
  >(
    collection: C,
    slug: E,
  ): E extends ValidContentEntrySlug<C>
    ? Promise<CollectionEntry<C>>
    : Promise<CollectionEntry<C> | undefined>;
  export function getEntry<
    C extends keyof DataEntryMap,
    E extends keyof DataEntryMap[C] | (string & {}),
  >(
    collection: C,
    id: E,
  ): E extends keyof DataEntryMap[C]
    ? Promise<DataEntryMap[C][E]>
    : Promise<CollectionEntry<C> | undefined>;

  /** Resolve an array of entry references from the same collection */
  export function getEntries<C extends keyof ContentEntryMap>(
    entries: {
      collection: C;
      slug: ValidContentEntrySlug<C>;
    }[],
  ): Promise<CollectionEntry<C>[]>;
  export function getEntries<C extends keyof DataEntryMap>(
    entries: {
      collection: C;
      id: keyof DataEntryMap[C];
    }[],
  ): Promise<CollectionEntry<C>[]>;

  export function reference<C extends keyof AnyEntryMap>(
    collection: C,
  ): import('astro/zod').ZodEffects<
    import('astro/zod').ZodString,
    C extends keyof ContentEntryMap
      ? {
          collection: C;
          slug: ValidContentEntrySlug<C>;
        }
      : {
          collection: C;
          id: keyof DataEntryMap[C];
        }
  >;
  // Allow generic `string` to avoid excessive type errors in the config
  // if `dev` is not running to update as you edit.
  // Invalid collection names will be caught at build time.
  export function reference<C extends string>(
    collection: C,
  ): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

  type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
  type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
    ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
  >;

  type ContentEntryMap = {
    docs: {
      'en/api/sdk/ballerine_sdk_flows.md': {
        id: 'en/api/sdk/ballerine_sdk_flows.md';
        slug: 'en/api/sdk/ballerine_sdk_flows';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.md'] };
      'en/api/sdk/end_user_info.md': {
        id: 'en/api/sdk/end_user_info.md';
        slug: 'en/api/sdk/end_user_info';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.md'] };
      'en/api/sdk/flows_backend_config.md': {
        id: 'en/api/sdk/flows_backend_config.md';
        slug: 'en/api/sdk/flows_backend_config';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.md'] };
      'en/api/sdk/flows_events_config.md': {
        id: 'en/api/sdk/flows_events_config.md';
        slug: 'en/api/sdk/flows_events_config';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.md'] };
      'en/api/sdk/flows_init_options.md': {
        id: 'en/api/sdk/flows_init_options.md';
        slug: 'en/api/sdk/flows_init_options';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.md'] };
      'en/api/sdk/flows_mount_options.md': {
        id: 'en/api/sdk/flows_mount_options.md';
        slug: 'en/api/sdk/flows_mount_options';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.md'] };
      'en/api/sdk/flows_translations.md': {
        id: 'en/api/sdk/flows_translations.md';
        slug: 'en/api/sdk/flows_translations';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.md'] };
      'en/collection-flow/iframe.mdx': {
        id: 'en/collection-flow/iframe.mdx';
        slug: 'en/collection-flow/iframe';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.mdx'] };
      'en/collection-flow/introduction.mdx': {
        id: 'en/collection-flow/introduction.mdx';
        slug: 'en/collection-flow/introduction';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.mdx'] };
      'en/collection-flow/json-form.mdx': {
        id: 'en/collection-flow/json-form.mdx';
        slug: 'en/collection-flow/json-form';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.mdx'] };
      'en/collection-flow/schema-breakdown.mdx': {
        id: 'en/collection-flow/schema-breakdown.mdx';
        slug: 'en/collection-flow/schema-breakdown';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.mdx'] };
      'en/collection-flow/theming.mdx': {
        id: 'en/collection-flow/theming.mdx';
        slug: 'en/collection-flow/theming';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.mdx'] };
      'en/collection-flow/ui-definition-updating.mdx': {
        id: 'en/collection-flow/ui-definition-updating.mdx';
        slug: 'en/collection-flow/ui-definition-updating';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.mdx'] };
      'en/collection-flow/ui-elements.mdx': {
        id: 'en/collection-flow/ui-elements.mdx';
        slug: 'en/collection-flow/ui-elements';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.mdx'] };
      'en/contributing.mdx': {
        id: 'en/contributing.mdx';
        slug: 'en/contributing';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.mdx'] };
      'en/deployment/ansible_deployment.mdx': {
        id: 'en/deployment/ansible_deployment.mdx';
        slug: 'en/deployment/ansible_deployment';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.mdx'] };
      'en/deployment/docker_compose.mdx': {
        id: 'en/deployment/docker_compose.mdx';
        slug: 'en/deployment/docker_compose';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.mdx'] };
      'en/examples/cdn_example.md': {
        id: 'en/examples/cdn_example.md';
        slug: 'en/examples/cdn_example';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.md'] };
      'en/examples/kitchen_sink_example.md': {
        id: 'en/examples/kitchen_sink_example.md';
        slug: 'en/examples/kitchen_sink_example';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.md'] };
      'en/examples/kyb_example.md': {
        id: 'en/examples/kyb_example.md';
        slug: 'en/examples/kyb_example';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.md'] };
      'en/examples/kyc_example.md': {
        id: 'en/examples/kyc_example.md';
        slug: 'en/examples/kyc_example';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.md'] };
      'en/examples/package_manager_example.md': {
        id: 'en/examples/package_manager_example.md';
        slug: 'en/examples/package_manager_example';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.md'] };
      'en/getting_started/glossary.md': {
        id: 'en/getting_started/glossary.md';
        slug: 'en/getting_started/glossary';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.md'] };
      'en/getting_started/installation.mdx': {
        id: 'en/getting_started/installation.mdx';
        slug: 'en/getting_started/installation';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.mdx'] };
      'en/getting_started/introduction.md': {
        id: 'en/getting_started/introduction.md';
        slug: 'en/getting_started/introduction';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.md'] };
      'en/learn/back_office.mdx': {
        id: 'en/learn/back_office.mdx';
        slug: 'en/learn/back_office';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.mdx'] };
      'en/learn/case_management_overview.md': {
        id: 'en/learn/case_management_overview.md';
        slug: 'en/learn/case_management_overview';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.md'] };
      'en/learn/creating_a_kyc_flow_and_deploying_it.mdx': {
        id: 'en/learn/creating_a_kyc_flow_and_deploying_it.mdx';
        slug: 'en/learn/creating_a_kyc_flow_and_deploying_it';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.mdx'] };
      'en/learn/embedded_sdk_api.mdx': {
        id: 'en/learn/embedded_sdk_api.mdx';
        slug: 'en/learn/embedded_sdk_api';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.mdx'] };
      'en/learn/getting_started.mdx': {
        id: 'en/learn/getting_started.mdx';
        slug: 'en/learn/getting_started';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.mdx'] };
      'en/learn/interacting_with_workflows.md': {
        id: 'en/learn/interacting_with_workflows.md';
        slug: 'en/learn/interacting_with_workflows';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.md'] };
      'en/learn/introduction.mdx': {
        id: 'en/learn/introduction.mdx';
        slug: 'en/learn/introduction';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.mdx'] };
      'en/learn/kit.md': {
        id: 'en/learn/kit.md';
        slug: 'en/learn/kit';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.md'] };
      'en/learn/kyb_manual_review_example.mdx': {
        id: 'en/learn/kyb_manual_review_example.mdx';
        slug: 'en/learn/kyb_manual_review_example';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.mdx'] };
      'en/learn/kyc_manual_review_example.mdx': {
        id: 'en/learn/kyc_manual_review_example.mdx';
        slug: 'en/learn/kyc_manual_review_example';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.mdx'] };
      'en/learn/kyc_manual_review_workflow_guide.mdx': {
        id: 'en/learn/kyc_manual_review_workflow_guide.mdx';
        slug: 'en/learn/kyc_manual_review_workflow_guide';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.mdx'] };
      'en/learn/native_mobile_apps.md': {
        id: 'en/learn/native_mobile_apps.md';
        slug: 'en/learn/native_mobile_apps';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.md'] };
      'en/learn/plugins.mdx': {
        id: 'en/learn/plugins.mdx';
        slug: 'en/learn/plugins';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.mdx'] };
      'en/learn/sdk_backend_configuration.mdx': {
        id: 'en/learn/sdk_backend_configuration.mdx';
        slug: 'en/learn/sdk_backend_configuration';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.mdx'] };
      'en/learn/sdk_events.mdx': {
        id: 'en/learn/sdk_events.mdx';
        slug: 'en/learn/sdk_events';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.mdx'] };
      'en/learn/sdk_translations.mdx': {
        id: 'en/learn/sdk_translations.mdx';
        slug: 'en/learn/sdk_translations';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.mdx'] };
      'en/learn/sdk_ui_configuration.mdx': {
        id: 'en/learn/sdk_ui_configuration.mdx';
        slug: 'en/learn/sdk_ui_configuration';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.mdx'] };
      'en/learn/sdk_ui_flows.md': {
        id: 'en/learn/sdk_ui_flows.md';
        slug: 'en/learn/sdk_ui_flows';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.md'] };
      'en/learn/simple_kyb_guide.mdx': {
        id: 'en/learn/simple_kyb_guide.mdx';
        slug: 'en/learn/simple_kyb_guide';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.mdx'] };
      'en/learn/ui_flows.mdx': {
        id: 'en/learn/ui_flows.mdx';
        slug: 'en/learn/ui_flows';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.mdx'] };
      'en/learn/understanding_workflows.md': {
        id: 'en/learn/understanding_workflows.md';
        slug: 'en/learn/understanding_workflows';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.md'] };
      'en/learn/workflow_builder_and_rule_engine_overview.md': {
        id: 'en/learn/workflow_builder_and_rule_engine_overview.md';
        slug: 'en/learn/workflow_builder_and_rule_engine_overview';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.md'] };
      'en/learn/workflow_definitions.md': {
        id: 'en/learn/workflow_definitions.md';
        slug: 'en/learn/workflow_definitions';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.md'] };
      'en/style_guidelines.md': {
        id: 'en/style_guidelines.md';
        slug: 'en/style_guidelines';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.md'] };
    };
  };

  type DataEntryMap = {};

  type AnyEntryMap = ContentEntryMap & DataEntryMap;

  type ContentConfig = typeof import('../src/content/config');
}

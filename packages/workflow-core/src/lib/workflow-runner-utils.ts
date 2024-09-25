import {
  ISerializableHttpPluginParams,
  SerializableValidatableTransformer,
  ValidatableTransformer,
} from './plugins/external-plugin/types';
import { HelpersTransformer, THelperFormatingLogic, Validator } from './utils';
import { JmespathTransformer } from './utils/context-transformers/jmespath-transformer';
import { JsonSchemaValidator } from './utils/context-validator/json-schema-validator';

export const fetchTransformers = (
  transformers: SerializableValidatableTransformer['transform'] & {
    name?: string;
  },
) => {
  return (Array.isArray(transformers) ? transformers : []).map(transformer => {
    if (transformer.transformer === 'jmespath')
      return new JmespathTransformer((transformer.mapping as string).replace(/\s+/g, ' '));

    if (transformer.transformer === 'helper') {
      return new HelpersTransformer(transformer.mapping as THelperFormatingLogic);
    }

    throw new Error(`Transformer ${transformer} is not supported`);
  });
};

export const fetchValidator = (
  validatorName: string,
  schema: ConstructorParameters<typeof JsonSchemaValidator>[0] | undefined,
) => {
  if (!schema) return;

  if (validatorName === 'json-schema') return new JsonSchemaValidator(schema);

  throw new Error(`Validator ${validatorName} is not supported`);
};

export const reqResTransformersObj = (
  apiPluginSchema: Pick<ISerializableHttpPluginParams, 'request' | 'response'>,
) => {
  let requestTransformer;
  let responseTransformer: ValidatableTransformer | undefined;
  let requestValidator: Validator | undefined;
  let responseValidator: Validator | undefined;

  if ('request' in apiPluginSchema) {
    if (apiPluginSchema.request && 'transform' in apiPluginSchema.request) {
      const requestTransformerLogic = apiPluginSchema.request
        .transform as SerializableValidatableTransformer['transform'] & {
        name?: string;
      };
      requestTransformer = fetchTransformers(requestTransformerLogic);

      requestValidator = fetchValidator(
        'json-schema',
        // @ts-expect-error TODO: fix this
        apiPluginSchema?.request?.schema,
      );
    }

    if (apiPluginSchema.response && 'transform' in apiPluginSchema.response) {
      const responseTransformerLogic = apiPluginSchema.response
        .transform as SerializableValidatableTransformer['transform'] & {
        name?: string;
      };
      // @ts-ignore
      responseTransformer = responseTransformerLogic && fetchTransformers(responseTransformerLogic);

      responseValidator = fetchValidator(
        'json-schema',
        // @ts-expect-error TODO: fix this
        apiPluginSchema?.response?.schema,
      );
    }
  }

  return { requestTransformer, requestValidator, responseTransformer, responseValidator };
};

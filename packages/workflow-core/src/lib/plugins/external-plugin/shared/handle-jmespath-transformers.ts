import { invariant } from 'outvariant';

import { Transformers } from '../../../utils';

// Deprecating JMESPath is in progress.
export const handleJmespathTransformers = ({
  pluginName,
  responseTransformers,
  requestTransformers,
}: {
  pluginName: string;
  requestTransformers: Transformers | undefined;
  responseTransformers: Transformers | undefined;
}) => {
  invariant(
    (requestTransformers ?? []).every(transformer => transformer.name !== 'jmespath-transformer'),
    `${pluginName} - JMESPath request transformers are not supported`,
  );

  invariant(
    (responseTransformers ?? []).every(transformer => transformer.name !== 'jmespath-transformer'),
    `${pluginName} - JMESPath response transformers are not supported`,
  );
};

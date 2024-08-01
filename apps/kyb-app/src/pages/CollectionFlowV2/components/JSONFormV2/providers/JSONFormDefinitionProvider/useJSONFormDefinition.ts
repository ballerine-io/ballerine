import { jsonFormDefinitionContext } from '@/pages/CollectionFlowV2/components/JSONFormV2/providers/JSONFormDefinitionProvider/json-form-definition.context';
import { useContext } from 'react';

export const useJSONFormDefinition = () => useContext(jsonFormDefinitionContext);

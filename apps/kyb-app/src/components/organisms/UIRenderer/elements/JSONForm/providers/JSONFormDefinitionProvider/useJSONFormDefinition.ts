import { jsonFormDefinitionContext } from '@/components/organisms/UIRenderer/elements/JSONForm/providers/JSONFormDefinitionProvider/json-form-definition.context';
import { useContext } from 'react';

export const useJSONFormDefinition = () => useContext(jsonFormDefinitionContext);

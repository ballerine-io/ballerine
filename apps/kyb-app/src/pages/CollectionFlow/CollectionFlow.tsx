import { useLanguageParam } from '@/hooks/useLanguageParam/useLanguageParam';
import { useUISchemasQuery } from '@/hooks/useUISchemasQuery';
import { FunctionComponent, useMemo } from 'react';
import { LoadingScreen } from './v1/components/atoms/LoadingScreen';
import { getCollectionFlowVersion } from './versions-repository';

export const CollectionFlow = () => {
  const { language } = useLanguageParam();
  const { data: schema, isLoading: isLoadingSchema } = useUISchemasQuery(language);

  const CollectionFlowComponent = useMemo(() => {
    const Component = getCollectionFlowVersion(schema?.version as number);

    return Component as FunctionComponent;
  }, [schema]);

  if (isLoadingSchema) {
    return <LoadingScreen />;
  }

  return CollectionFlowComponent ? (
    <CollectionFlowComponent />
  ) : (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
      <div className="text-3xl font-bold text-gray-800 mb-4">
        No version found for UI Definition version: {schema?.version}
      </div>
      <div className="text-lg text-gray-600">Please contact the support.</div>
    </div>
  );
};

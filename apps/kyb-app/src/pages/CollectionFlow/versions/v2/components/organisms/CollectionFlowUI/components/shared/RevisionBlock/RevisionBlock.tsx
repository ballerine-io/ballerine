import { UIPage } from '@/domains/collection-flow';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { CollectionFlowStepStatesEnum, getCollectionFlowState } from '@ballerine/common';
import { useMemo } from 'react';

interface IRevisionBlockProps {
  page: UIPage<'v2'>;
  context: CollectionFlowContext;
}

export const RevisionBlock = ({ page, context }: IRevisionBlockProps) => {
  const stepUnderRevision = useMemo(() => {
    const collectionFlowState = getCollectionFlowState(context);

    return collectionFlowState?.steps?.find(
      step =>
        step.stepName === page.stateName && step.state === CollectionFlowStepStatesEnum.revision,
    );
  }, [context, page.stateName]);

  if (!stepUnderRevision || !stepUnderRevision.reason) {
    return null;
  }

  return (
    <div className="my-4 mb-6 flex flex-col gap-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
      <h2 className="text-md font-bold text-amber-900">Please provide following information</h2>
      <p className="text-sm text-amber-800">
        <span className="font-bold">Commentary</span>: {stepUnderRevision.reason}
      </p>
    </div>
  );
};

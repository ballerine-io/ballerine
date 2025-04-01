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

  if (!stepUnderRevision) {
    return null;
  }

  return (
    <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 my-4 gap-4 flex flex-col">
      <h2 className="text-md font-bold text-amber-900">Please provide following information</h2>
      <p className="text-amber-800 text-sm">
        <span className="font-bold">Commentary</span>: {stepUnderRevision.reason}
      </p>
    </div>
  );
};

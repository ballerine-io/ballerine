import { tagToAccordionCardItem } from '@/common/components/molecules/DocumentTracker/constants';
import { IUseDocumentTrackerLogicParams } from '@/common/components/molecules/DocumentTracker/hooks/useDocumentTracker/interfaces';
import { processTrackersMap } from '@/common/components/molecules/DocumentTracker/adapters';
import { IDocumentTracker } from '@/common/components/molecules/DocumentTracker/adapters/document-tracker.abstract';
import { useCallback, useEffect, useMemo, useState } from 'react';

export const useDocumentTracker = ({ plugins, documents }: IUseDocumentTrackerLogicParams) => {
  const [uncollapsedItemValue, setUncollapsedItemValue] = useState<string>();
  const onValueChange = useCallback((value: string) => {
    setUncollapsedItemValue(value);
  }, []);

  const processTrackers = useMemo(
    () =>
      processes.reduce((list, processName) => {
        const DocumentTracker = processTrackersMap[processName as keyof typeof processTrackersMap];

        if (!DocumentTracker) {
          console.warn(`${processName} is unsupported.`);

          return list;
        }

        list.push(new DocumentTracker(workflow, plugins));

        return list;
      }, [] as IDocumentTracker[]),
    [workflow, plugins, processes],
  );

  const trackedProcesses = useMemo(() => {
    return processTrackers.map(processTracker => {
      return {
        title: processTracker.getReadableName(),
        name: processTracker.PROCESS_NAME,
        subitems: processTracker.buildItems(),
      };
    });
  }, [processTrackers]);

  useEffect(() => {
    onValueChange(tagToAccordionCardItem[tag as keyof typeof tagToAccordionCardItem]);
  }, [onValueChange, tag]);

  return {
    trackedProcesses,
    uncollapsedItemValue,
    onValueChange,
  };
};

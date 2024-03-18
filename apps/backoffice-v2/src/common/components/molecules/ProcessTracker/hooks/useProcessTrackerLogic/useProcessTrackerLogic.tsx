import { tagToAccordionCardItem } from '@/common/components/molecules/ProcessTracker/constants';
import { IUseProcessTrackerLogicParams } from '@/common/components/molecules/ProcessTracker/hooks/useProcessTrackerLogic/interfaces';
import { processTrackersMap } from '@/common/components/molecules/ProcessTracker/hooks/useProcessTrackerLogic/process-tracker-adapters';
import { IProcessTracker } from '@/common/components/molecules/ProcessTracker/hooks/useProcessTrackerLogic/process-tracker-adapters/process-tracker.abstract';
import { useCallback, useEffect, useMemo, useState } from 'react';

const defaultProcesses = ['collection-flow', 'third-party', 'ubos'];

export const useProcessTrackerLogic = ({
  plugins,
  workflow,
  processes = defaultProcesses,
}: IUseProcessTrackerLogicParams) => {
  const tags = useMemo(() => workflow?.tags || [], [workflow]);
  const tag = useMemo(
    () => tags?.find(tag => tagToAccordionCardItem[tag as keyof typeof tagToAccordionCardItem]),
    [tags],
  );

  const [uncollapsedItemValue, setUncollapsedItemValue] = useState<string>();
  const onValueChange = useCallback((value: string) => {
    setUncollapsedItemValue(value);
  }, []);

  const processTrackers = useMemo(
    () =>
      processes.reduce((list, processName) => {
        const ProcessTracker = processTrackersMap[processName as keyof typeof processTrackersMap];

        if (!ProcessTracker) {
          console.warn(`${processName} is unsupported.`);
          return list;
        }

        list.push(new ProcessTracker(workflow, plugins));

        return list;
      }, [] as IProcessTracker[]),
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

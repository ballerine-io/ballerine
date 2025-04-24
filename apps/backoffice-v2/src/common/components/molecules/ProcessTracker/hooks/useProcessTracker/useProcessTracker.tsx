import { tagToAccordionCardItem } from '@/common/components/molecules/ProcessTracker/constants';
import { IUseProcessTrackerLogicParams } from '@/common/components/molecules/ProcessTracker/hooks/useProcessTracker/interfaces';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { PROCESS_TRACKERS } from '../../process-trackers';

export const useProcessTracker = ({ workflow, processes }: IUseProcessTrackerLogicParams) => {
  const tags = useMemo(() => workflow?.tags || [], [workflow]);
  const tag = useMemo(
    () => tags?.find(tag => tagToAccordionCardItem[tag as keyof typeof tagToAccordionCardItem]),
    [tags],
  );

  const [uncollapsedItemValue, setUncollapsedItemValue] = useState<string>();
  const onValueChange = useCallback((value: string) => {
    setUncollapsedItemValue(value);
  }, []);

  const trackedProcesses = useMemo(
    () =>
      processes
        .map(process => {
          const ProcessTracker = PROCESS_TRACKERS[process as keyof typeof PROCESS_TRACKERS];

          if (!ProcessTracker) {
            console.warn(`${process} is unsupported.`);

            return null;
          }

          return {
            name: process,
            Component: ProcessTracker,
          };
        })
        .filter(Boolean),
    [processes],
  );

  useEffect(() => {
    onValueChange(tagToAccordionCardItem[tag as keyof typeof tagToAccordionCardItem]);
  }, [onValueChange, tag]);

  return {
    trackedProcesses,
    uncollapsedItemValue,
    onValueChange,
  };
};

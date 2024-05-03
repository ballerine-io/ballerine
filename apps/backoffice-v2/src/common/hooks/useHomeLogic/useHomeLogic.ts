import { ComponentProps } from 'react';
import { DateRangePicker } from '@/common/components/molecules/DateRangePicker/DateRangePicker';
import { useZodSearchParams } from '@/common/hooks/useZodSearchParams/useZodSearchParams';
import { HomeSearchSchema } from '@/pages/Home/home-search-schema';

export const useHomeLogic = () => {
  const [searchParams, setSearchParams] = useZodSearchParams(HomeSearchSchema);

  const handleDateRangeChange: ComponentProps<typeof DateRangePicker>['onChange'] = (range: {
    start: { toISOString: () => string };
    end: { toISOString: () => string };
  }) => {
    const from = range?.start?.toISOString() || '';
    const to = range?.end?.toISOString() || '';

    setSearchParams({ from, to });
  };

  return {
    from: searchParams.from || '',
    to: searchParams.to || '',
    handleDateRangeChange,
  };
};

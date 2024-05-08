import { ComponentProps } from 'react';
import { DateRangePicker } from '@/common/components/molecules/DateRangePicker/DateRangePicker';
import { useZodSearchParams } from '@/common/hooks/useZodSearchParams/useZodSearchParams';
import { HomeSearchSchema } from '@/pages/Home/home-search-schema';

export const useHomeLogic = () => {
  const [{ from, to }, setSearchParams] = useZodSearchParams(HomeSearchSchema);

  const handleDateRangeChange: ComponentProps<typeof DateRangePicker>['onChange'] = range => {
    const from = range?.from?.toISOString();
    const to = range?.to?.toISOString();

    setSearchParams({ from, to });
  };

  return {
    from,
    to,
    handleDateRangeChange,
  };
};

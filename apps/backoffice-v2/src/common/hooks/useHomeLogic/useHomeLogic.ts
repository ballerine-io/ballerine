import { useSearchParams } from 'react-router-dom';
import { useZodSearchParams } from '@/common/hooks/useZodSearchParams/useZodSearchParams';
import { HomeSearchSchema } from '@/pages/Home/home-search-schema';

export const useHomeLogic = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [dateRange, setDateRange] = useZodSearchParams(HomeSearchSchema);

  const handleDateRangeChange = (range: any) => {
    const from = range?.start?.toISOString() || '';
    const to = range?.end?.toISOString() || '';

    setSearchParams({ from, to });
    setDateRange({ from, to });
  };

  return {
    dateRange,
    handleDateRangeChange,
  };
};

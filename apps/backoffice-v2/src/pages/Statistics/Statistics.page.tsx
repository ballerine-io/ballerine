import React, { FunctionComponent, useEffect, useState } from 'react';
import { useZodSearchParams } from '@/common/hooks/useZodSearchParams/useZodSearchParams';
import { DateRange, dateRangeSchema } from '@/common/hooks/useZodSearchParams/dateRangeSchema';

export const Statistics: FunctionComponent = () => {
  const [dateRange, setDateRange] = useZodSearchParams(dateRangeSchema);

  useEffect(() => {
    dateRange && console.log(dateRange);
  }, [dateRange]);

  const fetchstatistics = async (from: DateRange['from'], to: DateRange['to']) => {
    try {
    } catch (error) {
      throw error;
    }
  };

  return (
    <div>
      <h2>Statistics</h2>
    </div>
  );
};

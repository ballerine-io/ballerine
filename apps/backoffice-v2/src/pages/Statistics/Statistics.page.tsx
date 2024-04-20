import React, { FunctionComponent, useEffect, useState } from 'react';
import { useZodSearchParams } from '@/common/hooks/useZodSearchParams/useZodSearchParams';
import { DateRange, dateRangeSchema } from '@/common/hooks/useZodSearchParams/dateRangeSchema';
import { useSearchParams } from 'react-router-dom';

export const Statistics: FunctionComponent = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [dateRange, setDateRange] = useZodSearchParams(dateRangeSchema);

  useEffect(()=>{
    fetchstatistics(dateRange.from, dateRange.to)
  }, [dateRange])

  const fetchstatistics = async (from: DateRange["from"], to: DateRange["to"]) => {
    try {
      
    } catch (error) {
      throw error
    }
  }

  return <div>statistics page</div>;
};

import { FunctionComponent } from 'react';
import 'leaflet/dist/leaflet.css';
import { useNominatimQuery } from './hooks/useNominatimQuery/useNominatimQuery';
import { IMapCellProps } from './interfaces';
import { Map } from '../../../../common/components/molecules/Map/Map';
import { ErrorAlert } from '../../../../common/components/atoms/ErrorAlert/ErrorAlert';
import { Skeleton } from '../../../../common/components/atoms/Skeleton/Skeleton';

export const MapCell: FunctionComponent<IMapCellProps> = ({ value }) => {
  const { data, isLoading, isError } = useNominatimQuery(value);

  const className = 'mt-6 h-[600px] w-[600px] rounded-md';

  if (isLoading) {
    return <Skeleton className={className} />;
  }

  if (isError || !data?.[0]?.lat || !data?.[0]?.lon) {
    return <ErrorAlert>Invalid address.</ErrorAlert>;
  }

  return (
    <Map
      latitude={data?.[0]?.lat}
      longitude={data?.[0]?.lon}
      className={className}
      popupContent={
        typeof value === 'string' ? value : `${value?.country}, ${value?.city}, ${value?.street}`
      }
    />
  );
};

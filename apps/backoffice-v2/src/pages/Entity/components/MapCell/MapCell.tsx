import { FunctionComponent } from 'react';
import 'leaflet/dist/leaflet.css';
import { useNominatimQuery } from './hooks/useNominatimQuery/useNominatimQuery';
import { IMapCellProps } from './interfaces';
import { Map } from '../../../../common/components/molecules/Map/Map';
import { ErrorAlert } from '../../../../common/components/atoms/ErrorAlert/ErrorAlert';

export const MapCell: FunctionComponent<IMapCellProps> = ({ value }) => {
  const { data } = useNominatimQuery(value);

  if (!data?.[0]?.lat || !data?.[0]?.lon) {
    return <ErrorAlert>Invalid address.</ErrorAlert>;
  }

  return (
    <Map
      latitude={data?.[0]?.lat}
      longitude={data?.[0]?.lon}
      popupContent={`${value?.country}, ${value?.city}, ${value?.street}`}
    />
  );
};

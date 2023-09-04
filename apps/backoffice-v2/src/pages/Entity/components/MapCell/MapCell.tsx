import { FunctionComponent } from 'react';
import 'leaflet/dist/leaflet.css';
import { Map } from '../../../../common/components/molecules/Map/Map';

export const MapCell: FunctionComponent<{
  address: string;
  latitude: number;
  longitude: number;
}> = ({ address, latitude, longitude }) => {
  return (
    <Map
      popupContent={address}
      latitude={latitude}
      longitude={longitude}
      className={'mt-6 h-[600px] w-[600px] rounded-md'}
    />
  );
};

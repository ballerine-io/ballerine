import { FunctionComponent } from 'react';
import { LatLngTuple } from 'leaflet';
import { AlertDescription } from '../../atoms/Alert/Alert.Description';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { IMapProps } from './interfaces';

export const Map: FunctionComponent<IMapProps> = ({ latitude, longitude, popupContent }) => {
  const position: LatLngTuple = [latitude, longitude];

  if (!latitude || !longitude) {
    return <AlertDescription>Invalid coordinates.</AlertDescription>;
  }

  return (
    <MapContainer center={position} zoom={13} className={`mt-6 h-[600px] rounded-md`}>
      <TileLayer
        attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        url={`https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png`}
      />
      <Marker position={position}>{popupContent && <Popup>{popupContent}</Popup>}</Marker>
    </MapContainer>
  );
};

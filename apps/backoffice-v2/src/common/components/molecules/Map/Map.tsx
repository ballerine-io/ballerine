import { FunctionComponent } from 'react';
import L, { LatLngTuple } from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { IMapProps } from './interfaces';

export const Map: FunctionComponent<IMapProps> = ({
  latitude,
  longitude,
  popupContent,
  className,
}) => {
  const position: LatLngTuple = [latitude, longitude];

  L.Marker.prototype.options.icon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
  });

  return (
    <MapContainer center={position} zoom={13} className={className}>
      <TileLayer
        attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        url={`https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png`}
      />
      <Marker position={position}>{popupContent && <Popup>{popupContent}</Popup>}</Marker>
    </MapContainer>
  );
};

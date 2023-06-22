import { FunctionComponent } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';

export interface IMapProps {
  id?: string;
  value: {
    country: string;
    city: string;
    street: string;
  };
}

export const Map: FunctionComponent<IMapProps> = ({
  value = {
    country: 'Israel',
    city: 'Tel Aviv',
    street: 'Teberias 1',
  },
}) => {
  const position: LatLngTuple = [51.505, -0.09];

  return (
    <MapContainer center={position} zoom={13} className={`mt-6 h-[600px] rounded-md`}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`}
      />
      <Marker position={position}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

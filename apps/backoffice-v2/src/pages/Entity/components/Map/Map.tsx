import { FunctionComponent } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '../../../../common/utils/fetcher/fetcher';
import { z } from 'zod';
import { Method } from '../../../../common/enums';
import { handleZodError } from '../../../../common/utils/handle-zod-error/handle-zod-error';
import { handlePromise } from '@ballerine/common';
import { isString } from '../../../../common/utils/is-string/is-string';
import { Alert } from '../../../../common/components/atoms/Alert/Alert';
import { AlertCircle } from 'lucide-react';
import { AlertTitle } from '../../../../common/components/atoms/Alert/Alert.Title';
import { AlertDescription } from '../../../../common/components/atoms/Alert/Alert.Description';

export interface IMapProps {
  id?: string;
  value: {
    country: string;
    city: string;
    street: string;
  };
}

export const useNominatimQuery = ({
  city,
  country,
  street,
}: {
  city: string;
  country: string;
  street: string;
}) => {
  return useQuery({
    queryKey: ['nominatim', 'search', { city, country, street }],
    queryFn: async () => {
      const [coordinates, error] = await handlePromise(
        fetcher({
          method: Method.GET,
          url: `https://nominatim.openstreetmap.org/search?city=${city}&country=${country}&street=${street}&format=json`,
          schema: z.array(
            z.object({
              lat: z.coerce.number(),
              lon: z.coerce.number(),
            }),
          ),
        }),
      );

      return handleZodError(error, coordinates);
    },
    staleTime: Infinity,
    refetchInterval: false,
    enabled:
      isString(city) &&
      !!city?.length &&
      isString(country) &&
      !!country?.length &&
      isString(street) &&
      !!street?.length,
  });
};

export const Map: FunctionComponent<IMapProps> = ({ value }) => {
  const { data } = useNominatimQuery(value);

  if (!data?.[0]?.lat || !data?.[0]?.lon) {
    return (
      <div className={`mt-3 p-1`}>
        <Alert variant={`destructive`} className={`w-full max-w-lg`}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Invalid address.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <MapContainer
      center={data?.[0] as LatLngTuple}
      zoom={13}
      className={`mt-6 h-[600px] rounded-md`}
    >
      <TileLayer
        attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        url={`https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png`}
      />
      <Marker position={data?.[0] as LatLngTuple}>
        <Popup>
          {value.country}, {value.city}, {value.street}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

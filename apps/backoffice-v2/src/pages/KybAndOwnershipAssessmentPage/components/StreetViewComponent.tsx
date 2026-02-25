import { GoogleMap, Marker, StreetViewPanorama, useJsApiLoader } from '@react-google-maps/api';
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Loader2 } from 'lucide-react';

import { Card } from '@/common/components/atoms/Card/Card';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { env } from '@/common/env/env';
import { NormalizedAddress } from '../types';
import { enrichAddressWithGeocodeResults, normalizeAddress } from '../utils/addressUtils';

const googleMapsLibraries = ['places', 'geometry'] satisfies Parameters<
  typeof useJsApiLoader
>[0]['libraries'];

interface StreetViewComponentProps {
  address: string;
  countryCode?: string;
}

type StreetViewStatus = 'LOADING' | 'OK' | 'GEOCODE_FAILED' | 'NOT_AVAILABLE' | 'ERROR';

export const StreetViewComponent: React.FC<StreetViewComponentProps> = ({
  address,
  countryCode,
}) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: env.VITE_GOOGLE_MAPS_API_KEY ?? '',
    libraries: googleMapsLibraries,
  });

  const [position, setPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const [addressDetails, setAddressDetails] = useState<NormalizedAddress>(
    normalizeAddress(address, countryCode),
  );
  const [streetViewStatus, setStreetViewStatus] = useState<StreetViewStatus>('LOADING');
  const scrollPositionRef = useRef<number>(0);

  const checkStreetViewAvailability = useCallback(
    (
      service: google.maps.StreetViewService,
      position: google.maps.LatLngLiteral,
      radius: number,
    ): Promise<google.maps.LatLngLiteral | null> => {
      return new Promise(resolve => {
        service.getPanorama(
          {
            location: position,
            preference: google.maps.StreetViewPreference.NEAREST,
            radius: radius,
            source: google.maps.StreetViewSource.OUTDOOR,
          },
          (panoData, status) => {
            console.log(`Street View status at ${radius}m:`, status);

            if (status === google.maps.StreetViewStatus.OK && panoData?.location?.latLng) {
              const panoLocation = panoData.location.latLng;
              resolve({
                lat: panoLocation.lat(),
                lng: panoLocation.lng(),
              });
            } else {
              resolve(null);
            }
          },
        );
      });
    },
    [],
  );

  const findNearestStreetViewPanorama = useCallback(
    async (initialPosition: google.maps.LatLngLiteral) => {
      const streetViewService = new google.maps.StreetViewService();

      try {
        const panoramaResult = await checkStreetViewAvailability(
          streetViewService,
          initialPosition,
          500,
        );

        if (panoramaResult) {
          scrollPositionRef.current = window.scrollY;
          setPosition(panoramaResult);
          setStreetViewStatus('OK');

          return;
        }

        const widerPanoramaResult = await checkStreetViewAvailability(
          streetViewService,
          initialPosition,
          2000,
        );

        if (widerPanoramaResult) {
          scrollPositionRef.current = window.scrollY;
          setPosition(widerPanoramaResult);
          setStreetViewStatus('OK');

          return;
        }

        setStreetViewStatus('NOT_AVAILABLE');
      } catch (error) {
        console.error('Error finding street view:', error);
        setStreetViewStatus('ERROR');
      }
    },
    [checkStreetViewAvailability],
  );

  const streetViewOptions = useMemo(
    () => ({
      enableCloseButton: false,
      addressControl: true,
      fullscreenControl: true,
      panControl: true,
      zoomControl: true,
      motionTracking: false,
      motionTrackingControl: false,
      pov: { heading: 0, pitch: 0 },
      zoom: 1,
      scrollwheel: false,
      disableDefaultUI: false,
      clickToGo: true,
    }),
    [],
  );

  useEffect(() => {
    if (!isLoaded || !address) {
      return;
    }

    setStreetViewStatus('LOADING');
    const initialAddressDetails = normalizeAddress(address, countryCode);
    setAddressDetails(initialAddressDetails);

    const geocodeAddress = async () => {
      try {
        const geocoder = new google.maps.Geocoder();

        const geocodeResultRaw = await new Promise<google.maps.GeocoderResult[] | null>(
          (resolve, reject) => {
            geocoder.geocode({ address }, (results, status) => {
              if (status === 'OK' && results && results.length > 0) {
                resolve(results);
              } else {
                console.error('Geocoding failed:', status);
                reject(new Error(`Geocoding failed: ${status}`));
              }
            });
          },
        );

        if (!geocodeResultRaw) {
          setStreetViewStatus('GEOCODE_FAILED');

          return;
        }

        const geocodeResult = geocodeResultRaw.at(0);
        const location = geocodeResult?.geometry.location;

        if (!location) {
          setStreetViewStatus('ERROR');

          return;
        }

        const initialPosition = { lat: location.lat(), lng: location.lng() };
        setPosition(initialPosition);

        const enrichedAddress = enrichAddressWithGeocodeResults(
          initialAddressDetails,
          geocodeResult,
        );
        setAddressDetails(enrichedAddress);

        await findNearestStreetViewPanorama(initialPosition);
      } catch (error) {
        console.error('Error in geocoding process:', error);
        setStreetViewStatus('ERROR');
      }
    };

    geocodeAddress();
  }, [isLoaded, address, countryCode, findNearestStreetViewPanorama]);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-row">
          <div className="w-1/2">
            <h3 className="mb-4 text-xl font-semibold">Headquarters Address</h3>

            <div className="flex flex-col space-y-2 pr-6">
              <div className="grid grid-cols-2 gap-4">
                <AddressDetailRow label="Country" value={addressDetails.country} />
                <AddressDetailRow label="State / Province / Region" value={addressDetails.state} />
                <AddressDetailRow label="City / Town" value={addressDetails.city} />
                <AddressDetailRow label="Street" value={addressDetails.street} />
                <AddressDetailRow label="Number" value={addressDetails.number} />
                <AddressDetailRow label="ZIP / Postal Code" value={addressDetails.postalCode} />
              </div>
            </div>
          </div>

          <div className="w-1/2">
            {isLoaded && position ? (
              <PanoramaContainer
                position={position}
                streetViewOptions={streetViewOptions}
                streetViewStatus={streetViewStatus}
              />
            ) : (
              <div className="flex h-64 items-center justify-center rounded-md bg-gray-100">
                <Loader2 className="size-8 animate-spin text-gray-500" />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const PanoramaContainer: React.FC<{
  position: google.maps.LatLngLiteral;
  streetViewOptions: google.maps.StreetViewPanoramaOptions;
  streetViewStatus: StreetViewStatus;
}> = ({ position, streetViewOptions, streetViewStatus }) => {
  const [mapVisible, setMapVisible] = useState(false);

  if (!env.VITE_GOOGLE_MAPS_API_KEY) {
    return (
      <Card className="flex size-full items-center justify-center">
        <CardContent className="p-6 text-center text-red-600">
          <p>Google Maps API key is required to display address information.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div style={{ height: '300px', width: '100%' }}>
      {streetViewStatus === 'OK' ? (
        <GoogleMap
          mapContainerStyle={{
            height: '100%',
            width: '100%',
            visibility: mapVisible ? 'visible' : 'hidden',
            position: 'relative',
          }}
          center={position}
          zoom={16}
        >
          <StreetViewPanorama
            position={position}
            visible={true}
            onLoad={() => {
              // HACK: Only make the map visible after load, so that google maps
              // cannot autofocus and cause the page to scroll
              setTimeout(() => {
                setMapVisible(true);
              }, 150);
            }}
            options={streetViewOptions}
          />
        </GoogleMap>
      ) : (
        <GoogleMap
          mapContainerStyle={{ height: '100%', width: '100%' }}
          center={position}
          zoom={17}
        >
          <Marker position={position} />
          {streetViewStatus === 'NOT_AVAILABLE' && (
            <div className="absolute left-0 top-0 z-10 m-2 rounded bg-white/80 p-2 text-sm text-gray-700">
              Street View is not available at this location.
            </div>
          )}
          {streetViewStatus === 'LOADING' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded bg-white/80 p-4">
                <Loader2 className="size-6 animate-spin text-gray-700" />
              </div>
            </div>
          )}
        </GoogleMap>
      )}
    </div>
  );
};

const AddressDetailRow = React.memo(
  ({ label, value }: { label: string; value: string | undefined }) => (
    <>
      <div className="font-medium">{label}</div>
      <div>{value}</div>
    </>
  ),
);

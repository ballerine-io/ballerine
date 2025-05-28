import { GoogleMap, Marker, StreetViewPanorama, useJsApiLoader } from '@react-google-maps/api';
import React, { useEffect, useState } from 'react';
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
    googleMapsApiKey: env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries: googleMapsLibraries,
  });

  const [position, setPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const [addressDetails, setAddressDetails] = useState<NormalizedAddress>(
    normalizeAddress(address, countryCode),
  );
  const [streetViewStatus, setStreetViewStatus] = useState<StreetViewStatus>('LOADING');

  useEffect(() => {
    if (!isLoaded || !address) return;

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

    const findNearestStreetViewPanorama = async (initialPosition: google.maps.LatLngLiteral) => {
      const streetViewService = new google.maps.StreetViewService();

      try {
        const panoramaResult = await checkStreetViewAvailability(
          streetViewService,
          initialPosition,
          500,
        );

        if (panoramaResult) {
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
          setPosition(widerPanoramaResult);
          setStreetViewStatus('OK');
          return;
        }

        setStreetViewStatus('NOT_AVAILABLE');
      } catch (error) {
        console.error('Error finding street view:', error);
        setStreetViewStatus('ERROR');
      }
    };

    const checkStreetViewAvailability = (
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
    };

    geocodeAddress();
  }, [isLoaded, address, countryCode]);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-row">
          <div className="w-1/2">
            <h3 className="mb-4 text-xl font-semibold">Headquarters Address</h3>

            <div className="flex flex-col space-y-2 pr-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="font-medium">Country</div>
                <div>{addressDetails.country}</div>

                <div className="font-medium">State / Province / Region</div>
                <div>{addressDetails.state}</div>

                <div className="font-medium">City / Town</div>
                <div>{addressDetails.city}</div>

                <div className="font-medium">Street</div>
                <div>{addressDetails.street}</div>

                <div className="font-medium">Number</div>
                <div>{addressDetails.number}</div>

                <div className="font-medium">ZIP / Postal Code</div>
                <div>{addressDetails.postalCode}</div>
              </div>
            </div>
          </div>

          <div className="w-1/2">
            {isLoaded && position ? (
              <div style={{ height: '300px', width: '100%' }}>
                {streetViewStatus === 'OK' ? (
                  <GoogleMap
                    mapContainerStyle={{ height: '100%', width: '100%' }}
                    center={position}
                    zoom={16}
                  >
                    <StreetViewPanorama
                      position={position}
                      visible={true}
                      options={{
                        enableCloseButton: false,
                        addressControl: true,
                        fullscreenControl: true,
                        panControl: true,
                        zoomControl: true,
                        motionTracking: false,
                        motionTrackingControl: false,
                        pov: { heading: 0, pitch: 0 },
                        zoom: 1,
                      }}
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
                          <Loader2 className="h-6 w-6 animate-spin text-gray-700" />
                        </div>
                      </div>
                    )}
                  </GoogleMap>
                )}
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-md bg-gray-100">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

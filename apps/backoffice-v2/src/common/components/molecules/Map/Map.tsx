import { FunctionComponent } from 'react';

export interface IMapProps {
  latitude: number;
  longitude: number;
  popupContent?: string;
  className?: string;
}

export const Map: FunctionComponent<IMapProps> = ({
  latitude,
  longitude,
  popupContent,
  className,
}) => {
  return (
    <div
      className={className}
      style={{ backgroundColor: '#f0f0f0', padding: '1rem', borderRadius: '0.375rem' }}
    >
      <p>Map component (using Leaflet) has been removed to reduce bundle size.</p>
      <p>
        Location: {latitude}, {longitude}
      </p>
      {popupContent && <p>Details: {popupContent}</p>}
    </div>
  );
};

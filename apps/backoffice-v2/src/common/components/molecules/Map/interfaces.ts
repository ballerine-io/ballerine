import { ReactNode } from 'react';

export interface IMapProps {
  latitude: number;
  longitude: number;
  popupContent?: ReactNode;
}

import { ReactNode } from 'react';

export interface IMapProps {
  latitude: number;
  longitude: number;
  className?: string;
  popupContent?: ReactNode;
}

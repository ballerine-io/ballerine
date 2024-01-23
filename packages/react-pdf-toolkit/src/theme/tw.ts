import { tailwindTheme } from '@/theme/tailwind-theme';
import { AnyObject } from '@ballerine/ui';
import { createTw } from 'react-pdf-tailwind';

export const tw = createTw(tailwindTheme) as (input: string) => AnyObject;

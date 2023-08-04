import { StepperContext } from '@app/components/atoms/Stepper/types';
import { createContext } from 'react';

export const stepperContext = createContext({} as StepperContext);

export const { Provider } = stepperContext;

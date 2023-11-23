import { stepperContext } from '@/components/atoms/Stepper/stepper.context';
import { useContext } from 'react';

export const useStepperContext = () => useContext(stepperContext);

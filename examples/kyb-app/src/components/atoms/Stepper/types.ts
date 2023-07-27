export type StepStatus = 'warning' | 'error' | 'completed' | 'idle';

export type StepperIndicatorMap = Record<StepStatus, React.ComponentType>;
export type StepperLabelsMap = Record<StepStatus, React.ComponentType<{ text: string }>>;

export interface StepperContext {
  indicatorsMap: StepperIndicatorMap;
  labelsMap: StepperLabelsMap;
}

export type StepStatus = 'warning' | 'completed' | 'idle';

export type StepperIndicatorMap = Record<StepStatus, React.ComponentType>;

export interface StepperContext {
  indicatorsMap: StepperIndicatorMap;
}

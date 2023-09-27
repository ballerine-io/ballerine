export type StepStatus = 'warning' | 'completed' | 'idle';

export type StepperLabelsMap = Record<StepStatus, React.ComponentType<{ text: string }>>;

export interface StepperContext {
  labelsMap: StepperLabelsMap;
}

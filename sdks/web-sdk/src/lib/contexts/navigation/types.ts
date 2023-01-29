import { TSteps } from '../configuration/types';

export interface IStep {
  name: TSteps;
  component: _SvelteComponent;
  type?: string;
}

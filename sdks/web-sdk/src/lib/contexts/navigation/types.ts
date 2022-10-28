import { Steps } from '../configuration/types';

export interface IStep {
  name: Steps;
  component: _SvelteComponent;
  type?: string;
}

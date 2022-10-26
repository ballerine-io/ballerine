import { Steps } from '../configuration/types';

export interface IStep {
  name: Steps;
  route: string;
  component: _SvelteComponent;
  type?: string;
}

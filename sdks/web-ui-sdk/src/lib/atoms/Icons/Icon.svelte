<script lang="ts">
  import Card from './Card.svelte';
  import Passport from './Passport.svelte';
  import License from './License.svelte';
  import PassportTwo from './PassportTwo.svelte';
  import Voter from './Voter.svelte';
  import { ICSSProperties, makesLocalStyles } from '../../services/css-manager';

  import type { SvelteComponent } from 'svelte';
  import type { Icons } from '../../contexts/configuration/types';
  import type { IElementProps } from '../../contexts/configuration';

  let icons: Record<Icons, typeof SvelteComponent> = {
    Card,
    Passport,
    License,
    PassportTwo,
    Voter,
  };

  export let name: Icons = 'Card';
  export let width: number | string = 16;
  export let height: number | string = 16;
  export let active = false;
  export let configuration: IElementProps;

  const style = makesLocalStyles(configuration.style as ICSSProperties);
  const icon = icons[name];
</script>

<div {style} class="icon" class:active>
  <svelte:component this={icon} {height} {width} style="transition: fill 0.3s" />
</div>

<style>
  .icon {
    display: contents;
    fill: var(--fill);
    color: var(--fill);
  }
  .icon.active {
    fill: var(--active-fill);
    color: var(--active-fill);
  }
</style>

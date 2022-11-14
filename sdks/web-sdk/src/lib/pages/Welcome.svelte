<script lang="ts">
  import { Image, Button, Title, Paragraph, IconButton, IconCloseButton } from '../atoms';
  import { configuration } from '../contexts/configuration';
  import { goToNextStep } from '../contexts/navigation/hooks';
  import { Elements } from '../contexts/configuration/types';
  import { makeStylesFromConfiguration } from '../utils/css-utils';
  import List from '../molecules/List/List.svelte';
  import { T } from '../contexts/translation';
  import { flowStart } from '../services/analytics';
  import { sendButtonClickEvent } from '../utils/event-service/utils';
  import { appState, currentStepId } from '../contexts/app-state';
  import merge from 'deepmerge';
  import { layout, welcomeStep } from '../default-configuration/theme';
  import { mergeStepConfig } from '../services/merge-service';
  import { preloadNextStepByCurrent } from '../services/preload-service';
  import { injectPrimaryIntoLayoutGradient } from '../services/theme-manager';
  import { EActionNames, EVerificationStatuses } from '../utils/event-service';

  export let stepId;

  const step = mergeStepConfig(welcomeStep, $configuration.steps[stepId]);
  const stepNamespace = step.namespace!;

  const style = makeStylesFromConfiguration(
    merge(
      injectPrimaryIntoLayoutGradient(layout, $configuration.general.colors.primary),
      $configuration.layout || {},
    ),
    step.style,
  );

  preloadNextStepByCurrent($configuration, configuration, $currentStepId);
</script>

<div class="container" {style}>
  {#each step.elements as element}
    {#if element.type === Elements.IconButton}
      <div>
        <IconButton
          configuration={element.props}
          on:click={() => {
            sendButtonClickEvent(
              EActionNames.CLOSE,
              { status: EVerificationStatuses.DATA_COLLECTION },
              $appState,
              true,
            );
          }}
        />
      </div>
    {/if}
    {#if element.type === Elements.IconCloseButton}
      <IconCloseButton
        configuration={element.props}
        on:click={() => {
          sendButtonClickEvent(
            EActionNames.CLOSE,
            { status: EVerificationStatuses.DATA_COLLECTION },
            $appState,
            true,
          );
        }}
      />
    {/if}
    {#if element.type === Elements.Image}
      <Image configuration={element.props} />
    {/if}
    {#if element.type === Elements.Title}
      <Title configuration={element.props}>
        <T key="title" namespace={stepNamespace} />
      </Title>
    {/if}
    {#if element.type === Elements.Paragraph}
      <Paragraph configuration={element.props}>
        <T key={element.props.context || ''} namespace={stepNamespace} />
      </Paragraph>
    {/if}
    {#if element.type === Elements.List}
      <List configuration={element.props} />
    {/if}
    {#if element.type === Elements.Button}
      <Button
        on:click={() => {
          flowStart();
          goToNextStep(currentStepId, $configuration, $currentStepId);
        }}
        configuration={element.props}
      >
        <T key="button" namespace={stepNamespace} />
      </Button>
    {/if}
  {/each}
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: var(--padding);
    position: var(--position);
    background: var(--background);
    line-height: var(--line-height);
    text-align: center;
  }
</style>

<script lang="ts">
  import { T } from '../contexts/translation';
  import { Image, Title, Paragraph, IconButton, IconCloseButton } from '../atoms';
  import { configuration } from '../contexts/configuration';
  import { Elements } from '../contexts/configuration';
  import { DocumentOptions } from '../organisms';
  import { goToPrevStep } from '../contexts/navigation';
  import { preloadNextStepByCurrent } from '../services/preload-service';
  import { currentStepId, appState } from '../contexts/app-state';
  import {
    EActionNames,
    sendButtonClickEvent,
    EVerificationStatuses,
  } from '../utils/event-service';
  import { getLayoutStyles, getStepConfiguration, uiPack } from '../ui-packs';
  import { getFlowConfig } from '../contexts/flows/hooks';

  export let stepId;

  const step = getStepConfiguration($configuration, $uiPack, stepId);
  const flow = getFlowConfig($configuration);
  const style = getLayoutStyles($configuration, $uiPack, step);

  const stepNamespace = step.namespace!;

  preloadNextStepByCurrent($configuration, configuration, stepId, $uiPack);
</script>

<div class="container" {style}>
  {#each step.elements as element}
    {#if element.type === Elements.IconButton}
      <IconButton
        configuration={element.props}
        on:click={() => goToPrevStep(currentStepId, $configuration, $currentStepId)}
      />
    {/if}
    {#if element.type === Elements.IconCloseButton && flow.showCloseButton}
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
        <T key={element.props.context || 'description'} namespace={stepNamespace} />
      </Paragraph>
    {/if}
  {/each}
  <DocumentOptions {step} />
</div>

<style>
  .container {
    position: var(--position);
    padding: var(--padding);
    text-align: center;
    background: var(--background);
    height: 100%;
  }
</style>

<script lang="ts">
  import { T } from '../contexts/translation';
  import { IconButton, IconCloseButton, Image, Paragraph, Title } from '../atoms';
  import { configuration, Elements } from '../contexts/configuration';
  import { DocumentOptions } from '../organisms';
  import { goToPrevStep } from '../contexts/navigation';
  import { preloadNextStepByCurrent } from '../services/preload-service';
  import { appState, currentStepId } from '../contexts/app-state';
  import { ActionNames, sendButtonClickEvent, VerificationStatuses } from '../utils/event-service';
  import { getLayoutStyles, getStepConfiguration } from '../ui-packs';
  import { getFlowConfig } from '../contexts/flows/hooks';

  export let stepId;

  const step = getStepConfiguration($configuration, stepId);
  const flow = getFlowConfig($configuration);
  const style = getLayoutStyles($configuration, step);

  const stepNamespace = step.namespace!;

  preloadNextStepByCurrent($configuration, configuration, stepId);
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
            ActionNames.CLOSE,
            { status: VerificationStatuses.DATA_COLLECTION },
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

<script lang="ts">
  import { getWorkflowContext } from '../../workflow-sdk/context';
  import { IconButton, IconCloseButton, Image, Paragraph, Title } from '../atoms';
  import { appState } from '../contexts/app-state';
  import { configuration, Elements } from '../contexts/configuration';
  import { getFlowConfig } from '../contexts/flows/hooks';
  import { T } from '../contexts/translation';
  import { DocumentOptions } from '../organisms';
  import { preloadNextStepByCurrent } from '../services/preload-service';
  import { getLayoutStyles, getStepConfiguration } from '../ui-packs';
  import { ActionNames, sendButtonClickEvent, VerificationStatuses } from '../utils/event-service';

  export let stepId;

  const step = getStepConfiguration($configuration, stepId);
  const flow = getFlowConfig($configuration);
  const style = getLayoutStyles($configuration, step);
  const workflowService = getWorkflowContext();
  const stepNamespace = step.namespace!;

  preloadNextStepByCurrent($configuration, configuration, stepId);
</script>

<div class="container" {style}>
  {#each step.elements as element}
    {#if element.type === Elements.IconButton}
      <IconButton
        configuration={element.props}
        on:click={() => workflowService.sendEvent({ type: 'USER_PREV_STEP' })}
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

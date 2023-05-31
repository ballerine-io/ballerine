<script lang="ts">
  import { IconButton, IconCloseButton, Image, NextStepButton, Paragraph, Title } from '../atoms';
  import { configuration } from '../contexts/configuration';
  import { Elements } from '../contexts/configuration/types';
  import List from '../molecules/List/List.svelte';
  import { T } from '../contexts/translation';
  import { sendButtonClickEvent } from '../utils/event-service/utils';
  import { appState } from '../contexts/app-state';
  import { preloadNextStepByCurrent } from '../services/preload-service';
  import { ActionNames, VerificationStatuses } from '../utils/event-service';
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
    {#if element.type === Elements.IconButton && flow.firstScreenBackButton}
      <div>
        <IconButton
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
      </div>
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
    {#if element.type === Elements.List}
      <List configuration={element.props} />
    {/if}
    {#if element.type === Elements.Button}
      <NextStepButton configuration={element.props}>
        <T key="button" namespace={stepNamespace} />
      </NextStepButton>
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

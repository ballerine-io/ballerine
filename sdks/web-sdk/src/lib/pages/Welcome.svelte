<script lang="ts">
  import { IconButton, Image, NextStepButton, Paragraph, Title } from '../atoms';
  import { configuration } from '../contexts/configuration';
  import { addCloseToURLParams } from '../contexts/navigation/hooks';
  import { Elements } from '../contexts/configuration/types';
  import { makeStylesFromConfiguration } from '../utils/css-utils';
  import List from '../molecules/List/List.svelte';
  import { T } from '../contexts/translation';
  import { sendButtonClickEvent } from '../utils/event-service/utils';
  import { appState } from '../contexts/app-state';
  import merge from 'lodash.merge';
  import { layout, welcomeStep } from '../default-configuration/theme';

  export let stepId;

  const step = merge(welcomeStep, $configuration.steps[stepId]);
  const stepNamespace = step.namespace!;
  const style = makeStylesFromConfiguration(merge(layout, $configuration.layout), step.style);
</script>

<div class="container" {style}>
  {#each step.elements as element}
    {#if element.type === Elements.IconButton}
      <div>
        <IconButton
          configuration={element.props}
          on:click={() => {
            sendButtonClickEvent('close', { status: 'document_collection' }, $appState, true);
            addCloseToURLParams();
          }}
        />
      </div>
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

<script lang="ts">
  import { Image, Button, Title, Paragraph, IconButton } from '../atoms';
  import { configuration, Steps } from '../contexts/configuration';
  import { goToNextStep, addCloseToURLParams } from '../contexts/navigation/hooks';
  import { Elements } from '../contexts/configuration/types';
  import { makeStylesFromConfiguration } from '../utils/css-utils';
  import List from '../molecules/List/List.svelte';
  import { T } from '../contexts/translation';
  import { flowStart } from '../services/analytics';
  import { sendButtonClickEvent } from '../utils/event-service/utils';
  import { appState, currentStepRoute } from '../contexts/app-state';
  import merge from 'lodash.merge';
  import { layout, welcomeStep } from '../default-configuration/theme';

  const step = merge(welcomeStep, $configuration.steps[Steps.Welcome]);
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
        <T key="title" module="welcome" />
      </Title>
    {/if}
    {#if element.type === Elements.Paragraph}
      <Paragraph configuration={element.props}>
        <T key={element.props.context || ''} module="welcome" />
      </Paragraph>
    {/if}
    {#if element.type === Elements.List}
      <List configuration={element.props} />
    {/if}
    {#if element.type === Elements.Button}
      <Button
        on:click={() => {
          flowStart();
          goToNextStep(step, currentStepRoute, $configuration);
        }}
        configuration={element.props}
      >
        <T key="button" module="welcome" />
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

<script lang="ts">
  import { T } from '../contexts/translation';
  import { Title, IconButton, Photo, Paragraph } from '../atoms';
  import { configuration, Steps } from '../contexts/configuration';
  import { Elements } from '../contexts/configuration/types';
  import { makeStylesFromConfiguration } from '../utils/cssUtils';
  import { goToPrevStep } from '../contexts/navigation';
  import { getDocImage, IDocumentInfo } from '../contexts/appState';
  import { NavigationButtons } from '../molecules';
  import { documents, selectedDocumentInfo, currentStepRoute } from '../contexts/appState/stores';
  import merge from 'lodash.merge';
  import { checkDocumentStep, layout } from '../defaultConfiguration/theme';

  const step = merge(checkDocumentStep, $configuration.steps[Steps.CheckDocument]);

  const style = makeStylesFromConfiguration(merge(layout, $configuration.layout), step.style);

  let documentInfo: IDocumentInfo | undefined = undefined;
  let image = '';
  let skipBackSide = false;

  $: {
    documentInfo = step.documentInfo || $selectedDocumentInfo;
    if (!documentInfo) {
      goToPrevStep(step, currentStepRoute, $configuration);
    }
    if (documentInfo) {
      image = getDocImage(documentInfo.type, $documents);
      skipBackSide = !documentInfo.backSide && !step.documentInfo;
    }
  }
</script>

<div class="container" {style}>
  {#each step.elements as element}
    {#if element.type === Elements.IconButton}
      <IconButton
        configuration={element.props}
        on:click={() => goToPrevStep(step, currentStepRoute, $configuration)}
      />
    {/if}
    {#if element.type === Elements.Title}
      <Title configuration={element.props}>
        <T key={`${documentInfo?.type}-title`} module="check-document" />
      </Title>
    {/if}
    {#if element.type === Elements.Paragraph}
      <Paragraph configuration={element.props}>
        <T key={`${documentInfo?.type}-description`} module="check-document" />
      </Paragraph>
    {/if}
    {#if element.type === Elements.Photo}
      <Photo configuration={element.props} src={image} />
    {/if}
  {/each}
  <NavigationButtons {step} {skipBackSide} />
</div>

<style>
  .container {
    padding: var(--padding);
    position: var(--position);
    background: var(--background);
    text-align: center;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
</style>

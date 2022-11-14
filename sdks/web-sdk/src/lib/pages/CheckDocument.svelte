<script lang="ts">
  import { T } from '../contexts/translation';
  import { Title, IconButton, Photo, Paragraph, IconCloseButton } from '../atoms';
  import { configuration } from '../contexts/configuration';
  import { Elements } from '../contexts/configuration/types';
  import { makeStylesFromConfiguration } from '../utils/css-utils';
  import { goToPrevStep } from '../contexts/navigation';
  import { DocumentType, getDocImage, appState } from '../contexts/app-state';
  import { NavigationButtons } from '../molecules';
  import { documents, currentStepId, selectedDocumentInfo } from '../contexts/app-state/stores';
  import merge from 'deepmerge';
  import { checkDocumentStep, layout } from '../default-configuration/theme';
  import { mergeStepConfig } from '../services/merge-service';
  import { preloadNextStepByCurrent } from '../services/preload-service';
  import { injectPrimaryIntoLayoutGradient } from '../services/theme-manager';
  import {
    EActionNames,
    sendButtonClickEvent,
    EVerificationStatuses,
  } from '../utils/event-service';

  export let stepId;

  const step = mergeStepConfig(checkDocumentStep, $configuration.steps[stepId]);
  const stepNamespace = step.namespace!;

  const style = makeStylesFromConfiguration(
    merge(
      injectPrimaryIntoLayoutGradient(layout, $configuration.general.colors.primary),
      $configuration.layout || {},
    ),
    step.style,
  );

  const documentType =
    ($configuration.steps[$currentStepId].type as DocumentType) || $selectedDocumentInfo.type;

  let image = '';
  let skipBackSide = false;

  $: {
    if (!documentType) {
      goToPrevStep(currentStepId, $configuration, $currentStepId);
    }
    if (documentType) {
      image = getDocImage(documentType, $documents);
    }
    if ($selectedDocumentInfo && !$selectedDocumentInfo.backSide) {
      skipBackSide = true;
    }
    preloadNextStepByCurrent(
      $configuration,
      configuration,
      $currentStepId,
      skipBackSide ? 'back-side' : undefined,
    );
  }
</script>

<div class="container" {style}>
  {#each step.elements as element}
    {#if element.type === Elements.IconButton}
      <IconButton
        configuration={element.props}
        on:click={() => goToPrevStep(currentStepId, $configuration, $currentStepId)}
      />
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
    {#if element.type === Elements.Title}
      <Title configuration={element.props}>
        <T key={'title'} namespace={stepNamespace} />
      </Title>
    {/if}
    {#if element.type === Elements.Paragraph}
      <Paragraph configuration={element.props}>
        <T key={'description'} namespace={stepNamespace} />
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

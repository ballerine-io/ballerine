<script lang="ts">
  import { configuration, IStepConfiguration } from '../../contexts/configuration';
  import DocumentOption from '../../molecules/DocumentOption/DocumentOption.svelte';
  import { goToNextStep } from '../../contexts/navigation';
  import type { DocumentType, IDocument, IDocumentInfo } from '../../contexts/app-state';
  import {
    documents,
    selectedDocumentInfo,
    currentStepRoute,
  } from '../../contexts/app-state/stores';
  import { addDocument } from '../../utils/photo-utils';
  import { isNativeCamera } from '../../contexts/flows/hooks';
  import { IDocumentOption } from '../../molecules/DocumentOption';
  import merge from 'lodash.merge';
  import { documentOptions } from '../../default-configuration/theme';

  export let step: IStepConfiguration;
  const ducumentOptions: IDocumentOption[] = [];

  const documentOptionsConfiguration = merge(documentOptions, $configuration.documentOptions);

  Object.keys(documentOptionsConfiguration.options).forEach((key: string) => {
    const type = key as DocumentType;
    const option = documentOptionsConfiguration.options[type] as IDocumentOption;
    ducumentOptions.push(option);
  });

  const handleSelectOption = async ({ detail }: { detail: string }) => {
    if (isNativeCamera($configuration)) return;
    const type = detail as DocumentType;
    const option = documentOptionsConfiguration.options[type];
    $selectedDocumentInfo = option?.document as IDocumentInfo;
    await navigator.mediaDevices.getUserMedia({ video: true });
    goToNextStep(step, currentStepRoute, $configuration);
  };

  const handlePhotoTake = async ({ detail }: { detail: { image: string; type: DocumentType } }) => {
    const option = documentOptionsConfiguration.options[detail.type];
    const document: IDocument = { type: detail.type, metadata: {}, pages: [] };
    const newDocumentsState: IDocument[] = addDocument(
      document.type,
      detail.image,
      $configuration,
      $documents,
      document,
    );
    $selectedDocumentInfo = option?.document as IDocumentInfo;
    $documents = newDocumentsState;
    goToNextStep(step, currentStepRoute, $configuration);
  };
</script>

<div class="document-options">
  {#each ducumentOptions as documentOption}
    <DocumentOption
      on:selectOption={handleSelectOption}
      on:photoTake={handlePhotoTake}
      configuration={documentOptionsConfiguration}
      attributes={documentOption.attributes}
      document={documentOption.document}
      active={$selectedDocumentInfo?.type === documentOption.document.type}
    />
  {/each}
</div>

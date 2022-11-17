<script lang="ts">
  import { configuration, IStepConfiguration } from '../../contexts/configuration';
  import DocumentOption from '../../molecules/DocumentOption/DocumentOption.svelte';
  import { goToNextStep } from '../../contexts/navigation';
  import type { DocumentType, IDocument, IDocumentInfo } from '../../contexts/app-state';
  import { currentStepId, documents, selectedDocumentInfo } from '../../contexts/app-state/stores';
  import { addDocument } from '../../utils/photo-utils';
  import { isNativeCamera } from '../../contexts/flows/hooks';
  import { IDocumentOption } from '../../molecules/DocumentOption';
  import merge from 'deepmerge';
  import { documentOptions } from '../../default-configuration/theme';
  import { checkIsCameraAvailable } from '../../services/camera-manager';

  export let step: IStepConfiguration;
  const ducumentOptions: IDocumentOption[] = [];

  const documentOptionsConfiguration = merge(documentOptions, $configuration.documentOptions || {});

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
    const isCameraAvailable = await checkIsCameraAvailable();
    if (!isCameraAvailable) return;
    goToNextStep(currentStepId, $configuration, $currentStepId);
  };

  const handleTakePhoto = async ({ detail }: { detail: { image: string; type: DocumentType } }) => {
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
    goToNextStep(currentStepId, $configuration, $currentStepId);
  };
</script>

<div class="document-options">
  {#each ducumentOptions as documentOption}
    <DocumentOption
      on:selectOption={handleSelectOption}
      on:photoTake={handleTakePhoto}
      configuration={documentOptionsConfiguration}
      attributes={documentOption.attributes}
      document={documentOption.document}
      active={$selectedDocumentInfo?.type === documentOption.document.type}
    />
  {/each}
</div>

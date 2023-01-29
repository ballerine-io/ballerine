<script lang="ts">
  import { configuration, IStepConfiguration } from '../../contexts/configuration';
  import DocumentOption from '../../molecules/DocumentOption/DocumentOption.svelte';
  import { goToNextStep } from '../../contexts/navigation';
  import type { IDocument, IDocumentInfo } from '../../contexts/app-state';
  import { currentStepId, documents, selectedDocumentInfo } from '../../contexts/app-state/stores';
  import { addDocument } from '../../utils/photo-utils';
  import { isNativeCamera } from '../../contexts/flows/hooks';
  import { IDocumentOption } from '../../molecules/DocumentOption';
  import { checkIsCameraAvailable } from '../../services/camera-manager';
  import { uiPack } from '../../ui-packs';
  import { IDocumentOptions } from './types';
  import { TDocumentKind, TDocumentType } from '../../contexts/app-state/types';

  export let step: IStepConfiguration;

  const documentOptions: IDocumentOption[] = [];

  const documentOptionsConfiguration = $configuration.components
    ?.documentOptions as IDocumentOptions;

  if (step.documentOptions) {
    step.documentOptions.forEach(option => {
      if (documentOptionsConfiguration.options[option.type]) {
        const configurationOption = documentOptionsConfiguration.options[
          option.type
        ] as IDocumentOption;
        documentOptions.push({
          ...configurationOption,
          document: {
            ...configurationOption.document,
            kind: option.kind,
          },
        });
      }
    });
  } else {
    Object.keys(documentOptionsConfiguration.options).forEach((key: string) => {
      const type = key as TDocumentType;
      const option = documentOptionsConfiguration.options[type] as IDocumentOption;
      documentOptions.push(option);
    });
  }

  const handleSelectOption = async ({ detail }: { detail: string }) => {
    if (isNativeCamera($configuration)) return;
    const kind = detail as TDocumentKind;
    const option = documentOptions.find(o => o.document.kind === kind) as IDocumentOption;
    $selectedDocumentInfo = option?.document as IDocumentInfo;
    const isCameraAvailable = await checkIsCameraAvailable();
    if (!isCameraAvailable) return;
    goToNextStep(currentStepId, $configuration, $currentStepId);
  };

  const handleTakePhoto = async ({
    detail,
  }: {
    detail: { image: string; type: TDocumentType };
  }) => {
    const option = documentOptionsConfiguration.options[detail.type];
    const document: IDocument = { type: detail.type, metadata: {}, pages: [] };
    const newDocumentsState: IDocument[] = addDocument(
      document.type,
      detail.image,
      $configuration,
      $uiPack,
      $documents,
      document,
    );
    $selectedDocumentInfo = option?.document as IDocumentInfo;
    $documents = newDocumentsState;
    goToNextStep(currentStepId, $configuration, $currentStepId);
  };
</script>

<div class="document-options">
  {#each documentOptions.sort((o1, o2) => o1.document.orderIndex - o2.document.orderIndex) as documentOption}
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

import { CollectionFlowStates, TCollectionFlowState } from '@/consts';
import { defaultContextSchema, DefaultContextSchema } from '@/schemas';

export class StateHelper {
  constructor(private context: DefaultContextSchema) {
    if (!this.context.collectionFlow?.state) {
      throw new Error('Collection flow state is not set.');
    }
  }

  set uiState(uiState: string) {
    if (!(uiState in this.context.collectionFlow!.state!.progress!)) {
      throw new Error(
        `uiState not found in ${Object.keys(
          this.context.collectionFlow!.state!.progress || {},
        ).join(', ')}: ${uiState}`,
      );
    }

    console.log(`UI State transition from ${this.uiState} to ${uiState}`);
    this.context.collectionFlow!.state!.uiState = uiState;
  }

  get uiState() {
    return this.context.collectionFlow!.state!.uiState;
  }

  set collectionFlowState(collectionFlowState: TCollectionFlowState) {
    if (!(collectionFlowState in CollectionFlowStates)) {
      throw new Error(
        `collectionFlowState not found in ${Object.keys(defaultContextSchema).join(
          ', ',
        )}: ${collectionFlowState}`,
      );
    }

    console.log(
      `Collection flow state transition from ${this.collectionFlowState} to ${collectionFlowState}`,
    );

    this.context.collectionFlow!.state!.collectionFlowState = collectionFlowState;
  }

  get collectionFlowState() {
    return this.context.collectionFlow!.state!.collectionFlowState;
  }

  get progress() {
    return this.context.collectionFlow!.state!.progress;
  }

  setStepCompletionState(step: string, isCompleted: boolean) {
    if (!this.context.collectionFlow?.state?.progress) {
      throw new Error('Collection flow state progress is not set.');
    }

    if (!(step in this.context.collectionFlow!.state!.progress!)) {
      throw new Error(
        `step not found in ${Object.keys(this.context.collectionFlow!.state!.progress || {}).join(
          ', ',
        )}: ${step}`,
      );
    }

    console.log(`Step: ${step} isCompleted: ${isCompleted}`);
    this.context.collectionFlow!.state!.progress![step] = { isCompleted };
  }

  isStepCompleted(step: string) {
    const progress = this.context.collectionFlow?.state?.progress;

    return progress?.[step]?.isCompleted || false;
  }

  override(state: NonNullable<NonNullable<DefaultContextSchema['collectionFlow']>['state']>) {
    this.context.collectionFlow!.state = state;

    console.log('StateHelper, context override', this.context.collectionFlow!.state);

    return this.context;
  }
}

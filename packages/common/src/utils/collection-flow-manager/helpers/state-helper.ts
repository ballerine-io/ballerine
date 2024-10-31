import { CollectionFlowStatuses, TCollectionFlowStatus } from '@/consts';
import { defaultContextSchema, DefaultContextSchema } from '@/schemas';

export class StateHelper {
  constructor(private context: DefaultContextSchema) {
    if (!this.context.collectionFlow?.state) {
      throw new Error('Collection flow state is not set.');
    }
  }

  set currentStep(currentStep: string) {
    if (!(currentStep in this.context.collectionFlow!.state!.progressBreakdown!)) {
      throw new Error(
        `uiState not found in ${Object.keys(
          this.context.collectionFlow!.state!.progressBreakdown || {},
        ).join(', ')}: ${currentStep}`,
      );
    }

    console.log(`UI State transition from ${this.currentStep} to ${currentStep}`);
    this.context.collectionFlow!.state!.currentStep = currentStep;
  }

  get currentStep() {
    return this.context.collectionFlow!.state!.currentStep;
  }

  set status(status: TCollectionFlowStatus) {
    if (!(status in CollectionFlowStatuses)) {
      throw new Error(
        `status not found in ${Object.keys(defaultContextSchema).join(', ')}: ${status}`,
      );
    }

    console.log(`Collection flow state transition from ${this.status} to ${status}`);

    this.context.collectionFlow!.state!.status = status;
  }

  get status() {
    return this.context.collectionFlow!.state!.status;
  }

  get progressBreakdown() {
    return this.context.collectionFlow!.state!.progressBreakdown;
  }

  setStepCompletionState(step: string, isCompleted: boolean) {
    if (!this.context.collectionFlow?.state?.progressBreakdown) {
      throw new Error('Collection flow state progress is not set.');
    }

    if (!(step in this.context.collectionFlow!.state!.progressBreakdown!)) {
      throw new Error(
        `step not found in ${Object.keys(
          this.context.collectionFlow!.state!.progressBreakdown || {},
        ).join(', ')}: ${step}`,
      );
    }

    console.log(`Step: ${step} isCompleted: ${isCompleted}`);
    this.context.collectionFlow!.state!.progressBreakdown![step] = { isCompleted };
  }

  isStepCompleted(step: string) {
    return this.context.collectionFlow!.state!.progressBreakdown![step]?.isCompleted || false;
  }

  override(state: NonNullable<NonNullable<DefaultContextSchema['collectionFlow']>['state']>) {
    this.context.collectionFlow!.state = state;

    console.log('StateHelper, context override', this.context.collectionFlow!.state);

    return this.context;
  }
}

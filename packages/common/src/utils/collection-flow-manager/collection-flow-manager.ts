import { CollectionFlowStates } from '@/consts';
import { DefaultContextSchema } from '@/schemas';
import { ConfigHelper } from './helpers/config-helper';
import { StateHelper } from './helpers/state-helper';
import {
  collectionFlowConfigValidationSchema,
  CollectionFlowManagerConfig,
} from './schemas/config-schema';

export class CollectionFlowManager<TContext extends DefaultContextSchema> {
  constructor(public context: TContext, private readonly _config?: CollectionFlowManagerConfig) {
    if (_config && !collectionFlowConfigValidationSchema(_config)) {
      throw new Error('Invalid collection flow manager config.');
    }

    this.context = structuredClone(context);
  }

  isStarted() {
    return Boolean(this.context?.collectionFlow?.state?.uiState);
  }

  start() {
    if (this.isStarted()) {
      throw new Error('Collection flow already started.');
    }

    const config: NonNullable<DefaultContextSchema['collectionFlow']>['config'] = {
      apiUrl: this._config?.apiUrl || '',
    };

    console.log('Collection Flow Context initiated with config: ', config);

    const state: NonNullable<DefaultContextSchema['collectionFlow']>['state'] = {
      uiState: this._config?.steps[0]?.stateName as string,
      collectionFlowState: CollectionFlowStates.pending,
      progress: this.buildProgressState(),
    };

    console.log('Collection Flow Context initiated with state: ', state);

    const collectionFlow: DefaultContextSchema['collectionFlow'] = {
      config,
      state,
      additionalInformation: this._config?.additionalInformation || {},
    };

    console.log('Collection Flow Context initiated with collectionFlow: ', collectionFlow);

    this.context.collectionFlow = collectionFlow;

    return this.context;
  }

  updateContext(context: TContext) {
    this.context = structuredClone(context);

    console.log('Collection Flow Context updated: ', this.context);
  }

  config() {
    if (!this.context.collectionFlow?.config) {
      throw new Error('Collection flow manager config is not set.');
    }

    return new ConfigHelper(this.context);
  }

  state() {
    if (!this.context.collectionFlow?.state) {
      throw new Error('Collection flow manager state is not set.');
    }

    return new StateHelper(this.context);
  }

  updateAdditionalInformation(
    additionalInformation: CollectionFlowManagerConfig['additionalInformation'],
  ) {
    this.context.collectionFlow!.additionalInformation = additionalInformation;

    console.log('Collection Flow Context updated with additionalInformation: ', this.context);

    return this.context;
  }

  private buildProgressState() {
    const progressState = this._config?.steps.reduce((acc, step) => {
      acc[step.stateName] = { isCompleted: false };

      return acc;
    }, {} as Record<string, { isCompleted: boolean }>);

    console.log('Collection Flow Context built progress state: ', progressState);

    return progressState;
  }
}

import { DefaultContextSchema } from '@/schemas';
import { CollectionFlowManagerConfig } from '../schemas/config-schema';

export class ConfigHelper {
  constructor(private context: DefaultContextSchema) {}

  get apiUrl(): string {
    return this.context.collectionFlow?.config?.apiUrl as string;
  }

  set apiUrl(apiUrl: string) {
    if (!this.context.collectionFlow?.config) {
      throw new Error('Collection flow config is not set.');
    }

    console.log(`API URL updated from ${this.apiUrl} to ${apiUrl}`);
    this.context.collectionFlow.config.apiUrl = apiUrl;
  }

  get steps(): CollectionFlowManagerConfig['steps'] {
    return this.context.collectionFlow?.config?.steps || [];
  }

  set steps(_) {
    throw new Error('Setting steps is not allowed after initialization.');
  }

  override(config: NonNullable<NonNullable<DefaultContextSchema['collectionFlow']>['config']>) {
    this.context.collectionFlow = {
      config,
    };

    console.log('ConfigHelper, context override', this.context.collectionFlow);

    return this.context;
  }
}

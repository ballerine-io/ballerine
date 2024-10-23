import { CollectionFlowContextSchema } from '../../../schemas/documents/collection-flow-context-schema';

export class ConfigHelper {
  constructor(private context: CollectionFlowContextSchema) {}

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

  get tokenId(): string {
    return this.context.collectionFlow?.config?.tokenId as string;
  }

  set tokenId(tokenId: string) {
    if (!this.context.collectionFlow?.config) {
      throw new Error('Collection flow config is not set.');
    }

    console.log(`Token ID updated from ${this.tokenId} to ${tokenId}`);
    this.context.collectionFlow.config.tokenId = tokenId;
  }

  override(
    config: NonNullable<NonNullable<CollectionFlowContextSchema['collectionFlow']>['config']>,
  ) {
    this.context.collectionFlow = {
      config,
    };

    console.log('ConfigHelper, context override', this.context.collectionFlow);

    return this.context;
  }
}

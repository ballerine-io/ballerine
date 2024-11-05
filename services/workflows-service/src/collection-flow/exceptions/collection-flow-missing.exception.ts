import { InternalServerErrorException } from '@nestjs/common';

export class CollectionFlowMissingException extends InternalServerErrorException {
  constructor() {
    super('Collection flow state is missing.');
  }
}

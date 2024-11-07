import { NotFoundException } from '@nestjs/common';

export class CollectionFlowMissingException extends NotFoundException {
  constructor() {
    super('Collection flow state is missing.');
  }
}

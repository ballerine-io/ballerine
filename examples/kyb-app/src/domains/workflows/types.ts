import { AnyObject } from '@ballerine/ui';

export interface RunWorkflowDto {
  workflowId: string;
  context: {
    entity: {
      id: string;
      endUserId: string;
      ballerineEntityId: string;
      type: 'business';
      data: AnyObject;
    };
  };
}

import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { DefaultContextSchema } from '@ballerine/common';
import { WorkflowRuntimeData } from '@prisma/client';

export const logDocumentWithoutId = ({
  line,
  logger,
  workflowRuntimeData,
}: {
  line: `${string} ${number}`;
  logger: AppLoggerService;
  workflowRuntimeData: WorkflowRuntimeData;
}) => {
  workflowRuntimeData?.context?.documents?.forEach(
    (document: DefaultContextSchema['documents'][number]) => {
      if (document?.id) return;

      logger.error('Document without an ID was found', {
        line,
        workflowRuntimeDataId: workflowRuntimeData?.id,
        // @ts-expect-error - error from Prisma types fix
        workflowDefinitionId: workflowRuntimeData?.workflowDefinition?.id,
        entity: {
          id: workflowRuntimeData?.context?.entity?.id,
          ballerineEntityId: workflowRuntimeData?.context?.entity?.ballerineEntityId,
        },
        document,
      });
    },
  );
};

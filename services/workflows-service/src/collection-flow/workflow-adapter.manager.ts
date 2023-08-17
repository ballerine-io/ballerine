import { UnsupportedFlowTypeException } from '@/collection-flow/exceptions/unsupported-flow-type.exception';
import { IWorkflowAdapter } from '@/collection-flow/workflow-adapters/abstract-workflow-adapter';
import { KYBParentKYCSessionExampleAdapter } from '@/collection-flow/workflow-adapters/kyb_parent_kyc_session_example/kyb_parent_kyc_session_example.workflow-adapter';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WorkflowAdapterManager {
  private readonly adapters: Record<string, IWorkflowAdapter> = {
    kyb_parent_kyc_session_example: new KYBParentKYCSessionExampleAdapter(),
  };

  getAdapter(type: string) {
    const adapter = this.adapters[type];

    if (!adapter) throw new UnsupportedFlowTypeException();

    return adapter;
  }
}

import { BusinessService } from '@/business/business.service';
import { TDocumentsWithoutPageType } from '@/common/types';
import { CustomerService } from '@/customer/customer.service';
import type { InputJsonValue, TProjectId, TProjectIds } from '@/types';
import type { UnifiedCallbackNames } from '@/workflow/types/unified-callback-names';
import { WorkflowService } from '@/workflow/workflow.service';
import { AnyRecord, EndUserActiveMonitoringsSchema, ProcessStatus } from '@ballerine/common';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { WorkflowRuntimeData } from '@prisma/client';
import { get, isObject, set } from 'lodash';
import { EndUserService } from '@/end-user/end-user.service';
import { z } from 'zod';
import { SentryService } from '@/sentry/sentry.service';
import {
  formatIndividualVerification,
  handleIndividualVerificationDocuments,
  TIndividualVerificationData,
} from '@/common/utils/idv';

const removeLastKeyFromPath = (path: string) => {
  return path?.split('.')?.slice(0, -1)?.join('.');
};

const UNIFIED_ERROR_STATUSES = new Set(['ERROR', 'EXPIRED']);

const getProcessStatusFromUnifiedPayload = (payload: AnyRecord): keyof typeof ProcessStatus => {
  if (payload?.error) return ProcessStatus.ERROR;

  const status = typeof payload?.status === 'string' ? payload.status : undefined;
  if (status === 'PENDING') return ProcessStatus.IN_PROGRESS;
  if (status && UNIFIED_ERROR_STATUSES.has(status)) return ProcessStatus.ERROR;

  return ProcessStatus.SUCCESS;
};

const getPluginNameFromResultDestination = (resultDestinationPath: string): string | undefined => {
  // resultDestinationPath examples:
  // - pluginsOutput.document_verification.data
  // - pluginsOutput.document-verification
  // - pluginsOutput.facial_verification
  const parts = resultDestinationPath?.split('.');
  if (!Array.isArray(parts) || parts.length < 2) return;

  if (parts[0] !== 'pluginsOutput') return;

  return parts[1] || undefined;
};

const normalizeUnifiedApiCallbackPayloadToPluginsOutput = ({
  workflowRuntime,
  data,
  resultDestinationPath,
}: {
  workflowRuntime: WorkflowRuntimeData;
  data: AnyRecord;
  resultDestinationPath: string;
}) => {
  const context = structuredClone(workflowRuntime.context) as AnyRecord;

  const basePath = resultDestinationPath.endsWith('.data')
    ? removeLastKeyFromPath(resultDestinationPath)
    : resultDestinationPath;

  if (!basePath) return context;

  const pluginName = getPluginNameFromResultDestination(basePath) || 'unified_api';
  const verificationStatus = typeof data?.status === 'string' ? data.status : undefined;

  const normalizedPluginOutput: AnyRecord = {
    ...(isObject(data) ? data : {}),
    // Preserve raw payload for backwards compatibility with older callbackUrl templates.
    ...(resultDestinationPath.endsWith('.data') ? { data } : {}),
    name: pluginName,
    verificationStatus,
    status: getProcessStatusFromUnifiedPayload(data),
  };

  set(context, basePath, normalizedPluginOutput);

  return context;
};

export const setPluginStatus = ({
  data,
  status,
  context,
  resultDestinationPath,
  ignoreLastKey = true,
}: {
  status: keyof typeof ProcessStatus;
  resultDestinationPath: string;
  context: Record<string, unknown>;
  data: Record<string, unknown>;
  ignoreLastKey?: boolean;
}) => {
  const resultDestinationPathWithoutLastKey = removeLastKeyFromPath(resultDestinationPath);
  const result = get(
    context,
    ignoreLastKey ? resultDestinationPathWithoutLastKey : resultDestinationPath,
  );

  const resultWithData = set({}, resultDestinationPath, ignoreLastKey ? data : { data });

  if (isObject(result) && 'status' in result && result.status) {
    return set(
      resultWithData,
      `${ignoreLastKey ? resultDestinationPathWithoutLastKey : resultDestinationPath}.status`,
      status,
    );
  }

  return resultWithData;
};

@Injectable()
export class HookCallbackHandlerService {
  private readonly logger = new Logger(HookCallbackHandlerService.name);

  constructor(
    protected readonly workflowService: WorkflowService,
    protected readonly customerService: CustomerService,
    protected readonly businessService: BusinessService,
    private readonly endUserService: EndUserService,
    private readonly sentryService: SentryService,
  ) {}

  async handleHookResponse({
    workflowRuntime,
    data,
    resultDestinationPath,
    processName,
    currentProjectId,
  }: {
    workflowRuntime: WorkflowRuntimeData;
    data: AnyRecord;
    resultDestinationPath: string;
    processName?: UnifiedCallbackNames;
    projectIds: TProjectIds;
    currentProjectId: TProjectId;
  }) {
    if (processName === 'kyc-unified-api') {
      const context = await this.mapCallbackDataToIndividual(
        data,
        workflowRuntime,
        resultDestinationPath,
        currentProjectId,
      );

      const aml = data.aml as
        | { endUserId: string; hits: Array<Record<string, unknown>> }
        | undefined;

      if (aml) {
        await this.updateEndUserWithAmlData({
          sessionId: data.id as string,
          amlHits: aml.hits,
          withActiveMonitoring: workflowRuntime.config.hasUboOngoingMonitoring ?? false,
          endUserId: aml.endUserId,
          projectId: currentProjectId,
          vendor: data.vendor as string,
        });
      }

      return context;
    }

    if (processName === 'aml-unified-api') {
      const aml = {
        ...(data.data as {
          id: string;
          endUserId: string;
          hits: Array<Record<string, unknown>>;
        }),
        vendor: data.vendor,
      };

      const attributePath = resultDestinationPath.split('.');

      const newContext = structuredClone(workflowRuntime.context);

      this.setNestedProperty(newContext, attributePath, aml);

      await this.updateEndUserWithAmlData({
        sessionId: aml.id,
        amlHits: aml.hits,
        withActiveMonitoring: workflowRuntime.context.ongoingMonitoring ?? false,
        endUserId: aml.endUserId,
        projectId: currentProjectId,
        vendor: data.vendor as string,
      });

      return newContext;
    }

    if (processName === 'website-monitoring') {
      return await this.prepareWebsiteMonitoringContext(
        data,
        workflowRuntime,
        resultDestinationPath,
        currentProjectId,
      );
    }

    if (processName === 'merchant-audit-report') {
      // return await this.prepareMerchantAuditReportContext(
      //   data as {
      //     reportData: Record<string, unknown>;
      //     base64Pdf: string;
      //     reportId: string;
      //     reportType: string;
      //     comparedToReportId?: string;
      //   },
      //   workflowRuntime,
      //   resultDestinationPath,
      //   currentProjectId,
      // );
    }

    if (processName === 'document-verification-unified-api') {
      return normalizeUnifiedApiCallbackPayloadToPluginsOutput({
        workflowRuntime,
        data,
        resultDestinationPath,
      });
    }

    if (processName === 'facial-verification-unified-api') {
      return normalizeUnifiedApiCallbackPayloadToPluginsOutput({
        workflowRuntime,
        data,
        resultDestinationPath,
      });
    }

    if (
      processName === 'business-document-verification-unified-api' ||
      processName === 'market-card-verification-unified-api' ||
      processName === 'address-verification-unified-api' ||
      processName === 'business-photo-analysis-unified-api' ||
      processName === 'loan-financial-analysis-unified-api'
    ) {
      return normalizeUnifiedApiCallbackPayloadToPluginsOutput({
        workflowRuntime,
        data,
        resultDestinationPath,
      });
    }

    return setPluginStatus({
      data,
      resultDestinationPath,
      status: data?.error ? ProcessStatus.ERROR : ProcessStatus.SUCCESS,
      context: workflowRuntime.context,
    });
  }

  async prepareWebsiteMonitoringContext(
    data: AnyRecord,
    workflowRuntime: WorkflowRuntimeData,
    resultDestinationPath: string,
    currentProjectId: TProjectId,
  ) {
    const { context } = workflowRuntime;
    const { reportData } = data;

    const business = await this.businessService.getByCorrelationId(context.entity.id, [
      currentProjectId,
    ]);

    if (!business) {
      throw new BadRequestException('Business not found.');
    }

    return setPluginStatus({
      resultDestinationPath,
      context: workflowRuntime.context,
      data: reportData as Record<string, unknown>,
      ignoreLastKey: false,
      status: ProcessStatus.SUCCESS,
    });
  }

  async mapCallbackDataToIndividual(
    data: AnyRecord,
    workflowRuntime: WorkflowRuntimeData,
    resultDestinationPath: string,
    currentProjectId: TProjectId,
  ) {
    const typedData = data as TIndividualVerificationData;
    const attributePath = resultDestinationPath.split('.');
    const context = JSON.parse(JSON.stringify(workflowRuntime.context));

    // F10: Idempotency check — if we've already processed a callback with this
    // sessionId, skip re-processing to prevent duplicate document persistence
    // when the Unified API retries a callback delivery.
    const callbackSessionId = (data as Record<string, unknown>)?.sessionId;
    if (
      callbackSessionId &&
      (context as Record<string, any>)._processedCallbackIds?.includes(callbackSessionId)
    ) {
      this.logger.log(`Skipping duplicate KYC callback for sessionId=${callbackSessionId}`);
      return context;
    }

    const result = formatIndividualVerification(typedData);
    const { documents, cleanupTempFiles } = await handleIndividualVerificationDocuments({
      kycDocument: typedData.document,
      kycDocumentImages: typedData.images ?? [],
      person: typedData.person,
    });
    const customer = await this.customerService.getByProjectId(currentProjectId);
    const persistedDocuments = await this.workflowService.copyDocumentsPagesFilesAndCreate(
      documents as TDocumentsWithoutPageType,
      (context as Record<string, any>).entity.id ||
        (context as Record<string, any>).entity.ballerineEntityId,
      currentProjectId,
      customer.name,
    );

    // F5: Clean up temp files now that documents are persisted
    cleanupTempFiles();

    this.setNestedProperty(context as Record<string, any>, attributePath, result);

    // F8: Only remove identification_document entries — preserve all non-ID documents
    // (e.g., business docs, financial docs) that may already exist in the context.
    // This is safe with ARRAY_MERGE_OPTION.REPLACE at the controller level because
    // we return the full filtered array, not an empty one.
    (context as Record<string, any>).documents =
      (context as Record<string, any>).documents?.filter(
        (document: any) => document.type !== 'identification_document',
      ) ?? [];
    (context as Record<string, any>).kycDocuments = persistedDocuments;

    // Store per-method verification breakdown in the workflow context so it
    // surfaces in the case management UI's JSON explorer. Operators can see
    // which methods ran, errored, or were skipped and each method's outcome.
    if (typedData.methodBreakdown && typedData.methodBreakdown.length > 0) {
      (context as Record<string, any>).verificationMethodBreakdown = typedData.methodBreakdown;
    }

    // F10: Record this callback's sessionId to prevent duplicate processing
    if (callbackSessionId) {
      const processedIds = (context as Record<string, any>)._processedCallbackIds ?? [];
      (context as Record<string, any>)._processedCallbackIds = [...processedIds, callbackSessionId];
    }

    return context;
  }

  setNestedProperty(obj: Record<string, any>, path: string[], value: AnyRecord) {
    let current = obj;

    for (let i = 0; i < path.length; i++) {
      if (i === path.length - 1) {
        current[path[i] as keyof typeof current] = {
          ...(current[path[i] as keyof typeof current] || {}),
          ...value,
        };
      } else {
        current[path[i] as keyof typeof current] =
          (current[path[i] as keyof typeof current] as unknown) || {};

        current = current[path[i] as keyof typeof current];
      }
    }
  }

  private async updateEndUserWithAmlData({
    sessionId,
    endUserId,
    amlHits,
    withActiveMonitoring,
    projectId,
    vendor,
  }: {
    sessionId: string;
    endUserId: string;
    amlHits: Array<Record<string, unknown>>;
    withActiveMonitoring: boolean;
    projectId: TProjectId;
    vendor: string;
  }) {
    const endUser = await this.endUserService.find(endUserId, [projectId]);

    if (!endUser) {
      return;
    }

    return await this.endUserService.updateById(endUserId, {
      data: {
        amlHits: amlHits.map(hit => ({ ...hit, vendor })) as InputJsonValue,
        ...(withActiveMonitoring
          ? {
              activeMonitorings: [
                ...(endUser.activeMonitorings as z.infer<typeof EndUserActiveMonitoringsSchema>),
                {
                  type: 'aml',
                  vendor,
                  monitoredUntil: new Date(
                    new Date().setFullYear(new Date().getFullYear() + 3),
                  ).toISOString(),
                  sessionId,
                },
              ],
            }
          : {}),
      },
    });
  }
}

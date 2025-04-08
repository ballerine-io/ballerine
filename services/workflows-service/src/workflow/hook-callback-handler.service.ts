import { BusinessService } from '@/business/business.service';
import { getFileMetadata } from '@/common/get-file-metadata/get-file-metadata';
import { TDocumentsWithoutPageType } from '@/common/types';
import { CustomerService } from '@/customer/customer.service';
import type { InputJsonValue, TProjectId, TProjectIds } from '@/types';
import type { UnifiedCallbackNames } from '@/workflow/types/unified-callback-names';
import { WorkflowService } from '@/workflow/workflow.service';
import { AnyRecord, EndUserActiveMonitoringsSchema, ProcessStatus } from '@ballerine/common';
import { BadRequestException, Injectable } from '@nestjs/common';
import { WorkflowRuntimeData } from '@prisma/client';
import fs from 'fs';
import { get, isObject, set } from 'lodash';
import * as tmp from 'tmp';
import { EndUserService } from '@/end-user/end-user.service';
import { z } from 'zod';
import { SentryService } from '@/sentry/sentry.service';

const removeLastKeyFromPath = (path: string) => {
  return path?.split('.')?.slice(0, -1)?.join('.');
};

const IGNORED_DECISION_CHECKS = ['newUser', 'newDocument'] as const;

const DECISION_CHECKS = [
  'allowedAge',
  'faceLiveness',
  'documentNotExpired',
  'geolocationMatch',
  'documentAccepted',
  'faceNotInBlocklist',
  'allowedIpLocation',
  'faceImageAvailable',
  'documentRecognised',
  'faceSimilarToPortrait',
  'validDocumentAppearance',
  'expectedTrafficBehaviour',
  'physicalDocumentPresent',
  'documentBackFullyVisible',
  'documentFrontFullyVisible',
  'documentBackImageAvailable',
  'faceImageQualitySufficient',
  'documentFrontImageAvailable',
  'documentImageQualitySufficient',
] as const;

const ALL_KNOWN_CHECKS = [...IGNORED_DECISION_CHECKS, ...DECISION_CHECKS] as const;

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

    return setPluginStatus({
      data,
      resultDestinationPath,
      status: ProcessStatus.SUCCESS,
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
    const attributePath = resultDestinationPath.split('.');
    const context = JSON.parse(JSON.stringify(workflowRuntime.context));
    const kycDocument = data.document as AnyRecord;
    const entity = this.formatEntityData(data);
    const issuer = this.formatIssuerData(kycDocument);
    const documentProperties = this.formatDocumentProperties(data, kycDocument);
    const pages = await this.formatPages(data);
    const decision = this.formatDecision(data);
    const documentCategory = (kycDocument.type as AnyRecord)?.value as string;
    const documents = this.formatDocuments(
      documentCategory,
      pages,
      issuer,
      documentProperties,
      kycDocument,
    );
    const customer = await this.customerService.getByProjectId(currentProjectId);
    const persistedDocuments = await this.workflowService.copyDocumentsPagesFilesAndCreate(
      documents as TDocumentsWithoutPageType,
      // @ts-expect-error - we don't validate `context` is an object
      context.entity.id || context.entity.ballerineEntityId,
      currentProjectId,
      customer.name,
    );

    const result = {
      entity: entity,
      decision: decision,
      aml: data.aml,
    };

    // @ts-expect-error - we don't validate `context` is an object
    this.setNestedProperty(context, attributePath, result);
    // @ts-expect-error - we don't validate `context` is an object
    context.documents = [
      // @ts-expect-error - we don't validate `context` is an object
      ...(context.documents?.filter(document => document.type !== 'identification_document') ?? []),
      ...persistedDocuments,
    ];

    return context;
  }

  private formatDocuments(
    documentCategory: string,
    pages: any[],
    issuer: AnyRecord,
    documentProperties: AnyRecord,
    kycDocument: AnyRecord,
  ) {
    return [
      {
        type: 'identification_document',
        category: documentCategory?.toLocaleLowerCase(),
        pages: pages,
        issuer: issuer,
        properties: documentProperties,
        issuingVersion: kycDocument['issueNumber'] || 1,
      },
    ];
  }

  private formatDecision(data: AnyRecord) {
    const insights = data.insights as Record<string, Record<string, string | null>>;

    const insightValues = Object.values(insights).flatMap(category => Object.entries(category));

    const unknownValues = insightValues.filter(([check]) => !ALL_KNOWN_CHECKS.includes(check));

    if (unknownValues.length > 0) {
      this.sentryService.captureException(
        `Unknown KYC decision checks: ${unknownValues.join(', ')}`,
      );
    }

    const riskLabels = insightValues
      .filter(([label, result]) => IGNORED_DECISION_CHECKS.includes(label) && result !== 'yes')
      .map(([label]) => label);

    return {
      riskLabels,
      status: data.decision,
      decisionReason: data.reason,
      decisionScore: data.decisionScore,
    };
  }

  private formatEntityData(data: AnyRecord) {
    const person = data.person as AnyRecord;
    const additionalInfo = {
      gender: (person['gender'] as any)?.value,
      nationality: (person['nationality'] as any)?.value,
      placeOfBirth: (person['placeOfBirth'] as any)?.value,
      addresses: (person['addresses'] as any)?.value,
    };

    const entityInformation = {
      firstName: (person['firstName'] as any)?.value,
      lastName: (person['lastName'] as any)?.value,
      dateOfBirth: (person['dateOfBirth'] as any)?.value,
      additionalInfo: additionalInfo,
    };

    return {
      type: 'individual',
      data: entityInformation,
    };
  }

  private formatIssuerData(kycDocument: AnyRecord) {
    const additionalIssuerInfor = {
      validFrom: (kycDocument['validFrom'] as any)?.value,
      validUntil: (kycDocument['validUntil'] as any)?.value, // Add type assertion here
      firstIssue: (kycDocument['firstIssue'] as any)?.value,
    };

    return {
      additionalInfo: additionalIssuerInfor,
      country: (kycDocument['country'] as any)?.value,
      // name: kycDocument['issuedBy'],
      city: (kycDocument['placeOfIssue'] as any)?.value,
    };
  }

  async formatPages(data: AnyRecord) {
    const documentImages: AnyRecord[] = [];

    for (const image of data.images as Array<{ context?: string; content: string }>) {
      const tmpFile = tmp.fileSync({ keep: false }).name;
      const base64ImageContent = image.content.split(',')[1];
      const buffer = Buffer.from(base64ImageContent as string, 'base64');
      const fileType = await getFileMetadata({
        file: buffer,
      });
      const fileWithExtension = `${tmpFile}${fileType?.extension ? `.${fileType?.extension}` : ''}`;

      fs.writeFileSync(fileWithExtension, buffer);

      documentImages.push({
        uri: `file://${fileWithExtension}`,
        provider: 'file-system',
        type: fileType?.mimeType,
        metadata: {
          side: image.context?.replace('document-', ''),
        },
      });
    }

    return documentImages;
  }

  private formatDocumentProperties(data: AnyRecord, kycDocument: AnyRecord) {
    const person = data.person as AnyRecord;

    return {
      expiryDate: (kycDocument['validUntil'] as any)?.value,
      idNumber: (person['idNumber'] as any)?.value,
      validFrom: (kycDocument['validFrom'] as any)?.value,
      validUntil: (kycDocument['validUntil'] as any)?.value,
      firstIssue: (kycDocument['firstIssue'] as any)?.value,
    };
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

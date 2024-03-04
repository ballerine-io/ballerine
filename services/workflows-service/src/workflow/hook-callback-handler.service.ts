import { set } from 'lodash';
import { Injectable } from '@nestjs/common';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { AnyRecord, isObject, ProcessStatus } from '@ballerine/common';
import type { UnifiedCallbackNames } from '@/workflow/types/unified-callback-names';
import { WorkflowService } from '@/workflow/workflow.service';
import { WorkflowRuntimeData } from '@prisma/client';
import * as tmp from 'tmp';
import fs from 'fs';
import { CustomerService } from '@/customer/customer.service';
import type { TProjectId, TProjectIds } from '@/types';
import { TDocumentsWithoutPageType } from '@/common/types';
import { getFileMetadata } from '@/common/get-file-metadata/get-file-metadata';
import get from 'lodash/get';

@Injectable()
export class HookCallbackHandlerService {
  constructor(
    protected readonly workflowService: WorkflowService,
    protected readonly customerService: CustomerService,
    private readonly logger: AppLoggerService,
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
      return await this.mapCallbackDataToIndividual(
        data,
        workflowRuntime,
        resultDestinationPath,
        currentProjectId,
      );
    }

    const removeLastKeyFromPath = (path: string) => {
      return path?.split('.')?.slice(0, -1)?.join('.');
    };

    const resultDestinationPathWithoutLastKey = removeLastKeyFromPath(resultDestinationPath);
    const result = get(workflowRuntime.context, resultDestinationPathWithoutLastKey);

    if (isObject(result) && result.status) {
      set(
        workflowRuntime.context,
        `${resultDestinationPathWithoutLastKey}.status`,
        ProcessStatus.SUCCESS,
      );
    }

    return set({}, resultDestinationPath, data);
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
      // @ts-expect-error - we don't validate `context` is an object1
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
    context.documents = persistedDocuments;

    return context;
  }

  private formatDocuments(
    documentCategory: string,
    pages: any[],
    issuer: AnyRecord,
    documentProperties: AnyRecord,
    kycDocument: AnyRecord,
  ) {
    const documents = [
      {
        type: 'identification_document',
        category: documentCategory?.toLocaleLowerCase(),
        pages: pages,
        issuer: issuer,
        properties: documentProperties,
        issuingVersion: kycDocument['issueNumber'] || 1,
      },
    ];

    return documents;
  }

  private formatDecision(data: AnyRecord) {
    const insights = data.insights as AnyRecord[]; // Explicitly type 'insights' as 'AnyRecord[]'

    return {
      status: data.decision,
      decisionReason: data.reason,
      decisionScore: data.decisionScore,
      riskLabels:
        insights &&
        insights.map &&
        insights
          .map((insight: AnyRecord) => {
            if (insight.result === 'yes') {
              return insight.label;
            }
          })
          .filter((x: any) => Boolean(x))
          .join(', '),
    };
  }

  private formatEntityData(data: AnyRecord) {
    const person = data.person as AnyRecord;
    const additionalInfo = {
      gender: (person['gender'] as any)?.value,
      nationality: (person['nationality'] as any)?.value,
      // yearOfBirth: person['yearOfBirth'],
      placeOfBirth: (person['placeOfBirth'] as any)?.value,
      // pepSanctionMatch: person['pepSanctionMatch'],
      addresses: (person['addresses'] as any)?.value,
    };

    const entityInformation = {
      // nationalId: person['idNumber'],
      firstName: (person['firstName'] as any)?.value,
      lastName: (person['lastName'] as any)?.value,
      dateOfBirth: (person['dateOfBirth'] as any)?.value,
      // email: person['email'],
      additionalInfo: additionalInfo,
    };
    const entity = {
      type: 'individual',
      data: entityInformation,
    };

    return entity;
  }

  private formatIssuerData(kycDocument: AnyRecord) {
    const additionalIssuerInfor = {
      validFrom: (kycDocument['validFrom'] as any)?.value,
      validUntil: (kycDocument['validUntil'] as any)?.value, // Add type assertion here
      firstIssue: (kycDocument['firstIssue'] as any)?.value,
    };
    const issuer = {
      additionalInfo: additionalIssuerInfor,
      country: (kycDocument['country'] as any)?.value,
      // name: kycDocument['issuedBy'],
      city: (kycDocument['placeOfIssue'] as any)?.value,
    };

    return issuer;
  }

  async formatPages(data: AnyRecord) {
    const documentImages: AnyRecord[] = [];

    for (const image of data.images as Array<{ context?: string; content: string }>) {
      const tmpFile = tmp.fileSync().name;
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
    const properties = {
      expiryDate: (kycDocument['validUntil'] as any)?.value,
      idNumber: (person['idNumber'] as any)?.value,
      validFrom: (kycDocument['validFrom'] as any)?.value,
      validUntil: (kycDocument['validUntil'] as any)?.value,
      firstIssue: (kycDocument['firstIssue'] as any)?.value,
    };

    return properties;
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
}

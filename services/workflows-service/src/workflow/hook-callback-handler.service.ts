import { set } from 'lodash';
import { Injectable } from '@nestjs/common';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { AnyRecord } from '@ballerine/common';
import type { UnifiedCallbackNames } from '@/workflow/types/unified-callback-names';
import { WorkflowService } from '@/workflow/workflow.service';
import { WorkflowRuntimeData } from '@prisma/client';
import * as tmp from 'tmp';
import fs from 'fs';
import { CustomerService } from '@/customer/customer.service';
import type { TProjectId, TProjectIds } from '@/types';
import { TDocumentsWithoutPageType } from '@/common/types';
import { getFileMetadata } from '@/common/get-file-metadata/get-file-metadata';

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

    set(workflowRuntime.context, resultDestinationPath, data);

    await this.workflowService.updateWorkflowRuntimeData(
      workflowRuntime.id,
      {
        context: workflowRuntime.context,
      },
      currentProjectId,
    );

    return data;
  }
  async mapCallbackDataToIndividual(
    data: AnyRecord,
    workflowRuntime: WorkflowRuntimeData,
    resultDestinationPath: string,
    currentProjectId: TProjectId,
  ) {
    const attributePath = resultDestinationPath.split('.');
    const context = workflowRuntime.context;
    const kycDocument = data.document as AnyRecord;
    const entity = this.formatEntityData(data);
    const issuer = this.formatIssuerData(kycDocument);
    const documentProperties = this.formatDocumentProperties(data, kycDocument);
    const pages = await this.formatPages(data);
    const decision = this.formatDecision(data);
    const documentCategory = kycDocument.type as string;
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
      context.entity.id || context.entity.ballerineEntityId,
      currentProjectId,
      customer.name,
    );

    const result = {
      entity: entity,
      decision: decision,
      aml: data.aml,
    };

    this.setNestedProperty(context, attributePath, result);
    context.documents = persistedDocuments;
    await this.workflowService.updateWorkflowRuntimeData(
      workflowRuntime.id,
      { context: context },
      currentProjectId,
    );
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
        issuingVersion: kycDocument['issueNumber'],
      },
    ];

    return documents;
  }

  private formatDecision(data: AnyRecord) {
    return {
      status: data.decision,
      decisionReason: data.reason,
      riskLabels: data.riskLabels,
    };
  }

  private formatEntityData(data: AnyRecord) {
    const person = data.person as AnyRecord;
    const additionalInfo = {
      gender: person['gender'],
      nationality: person['nationality'],
      yearOfBirth: person['yearOfBirth'],
      placeOfBirth: person['placeOfBirth'],
      pepSanctionMatch: person['pepSanctionMatch'],
      addresses: person['addresses'],
    };

    const entityInformation = {
      nationalId: person['idNumber'],
      firstName: person['firstName'],
      lastName: person['lastName'],
      dateOfBirth: person['dateOfBirth'],
      email: person['email'],
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
      validFrom: kycDocument['validFrom'],
      validUntil: kycDocument['validUntil'],
      firstIssue: kycDocument['firstIssue'],
    };
    const issuer = {
      additionalInfo: additionalIssuerInfor,
      country: kycDocument['country'],
      name: kycDocument['issuedBy'],
      city: kycDocument['placeOfIssue'],
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
      expiryDate: kycDocument['validUntil'],
      idNumber: person['idNumber'],
      validFrom: kycDocument['validFrom'],
      validUntil: kycDocument['validUntil'],
      firstIssue: kycDocument['firstIssue'],
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

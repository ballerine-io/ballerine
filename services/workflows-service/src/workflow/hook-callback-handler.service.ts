import { Injectable } from '@nestjs/common';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { AnyRecord, DefaultContextSchema } from '@ballerine/common';
import { UnifiedCallbackNames } from '@/workflow/types/unified-callback-names';
import { WorkflowService } from '@/workflow/workflow.service';
import { WorkflowRuntimeData } from '@prisma/client';
import * as tmp from 'tmp';
import fs from 'fs';
import { TProjectIds } from '@/types';

@Injectable()
export class HookCallbackHandlerService {
  async handleHookResponse({
    workflowRuntime,
    data,
    resultDestinationPath,
    processName,
    projectIds,
  }: {
    workflowRuntime: WorkflowRuntimeData;
    data: AnyRecord;
    resultDestinationPath: string;
    processName?: UnifiedCallbackNames;
    projectIds: TProjectIds;
  }) {
    if (processName === 'kyc-unified-api') {
      return await this.mapCallbackDataToIndividual(
        data,
        workflowRuntime,
        resultDestinationPath,
        projectIds,
      );
    }

    const updatedContext = { ...workflowRuntime.context, [resultDestinationPath]: data };
    await this.workflowService.updateWorkflowRuntimeData(workflowRuntime.id, {
      context: updatedContext,
    });

    return data;
  }

  constructor(
    protected readonly workflowService: WorkflowService,
    private readonly logger: AppLoggerService,
  ) {}

  async mapCallbackDataToIndividual(
    data: AnyRecord,
    workflowRuntime: WorkflowRuntimeData,
    resultDestinationPath: string,
    projectIds: TProjectIds,
  ) {
    const attributePath = resultDestinationPath.split('.');
    const context = workflowRuntime.context;
    const kycDocument = data.document as AnyRecord;
    const entity = this.formatEntityData(data);
    const issuer = this.formatIssuerData(kycDocument);
    const documentProperties = this.formatDocumentProperties(data, kycDocument);
    const pages = this.formatPages(data);
    const decision = this.formatDecision(data);
    const documentCategory = kycDocument.type as string;
    const documents = this.formatDocuments(documentCategory, pages, issuer, documentProperties);
    const persistedDocuments = await this.workflowService.copyDocumentsPagesFilesAndCreate(
      documents as DefaultContextSchema['documents'],
      context.entity.id,
      projectIds,
    );

    const result = {
      entity: entity,
      decision: decision,
      aml: data.aml,
    };

    this.setNestedProperty(context, attributePath, result);
    context.documents = persistedDocuments;
    await this.workflowService.updateWorkflowRuntimeData(workflowRuntime.id, { context: context });
  }

  private formatDocuments(
    documentCategory: string,
    pages: any[],
    issuer: AnyRecord,
    documentProperties: AnyRecord,
  ) {
    const documents = [
      {
        type: 'identification_document',
        category: documentCategory?.toLocaleLowerCase(),
        pages: pages,
        issuer: issuer,
        properties: documentProperties,
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
      additionalDetails: additionalIssuerInfor,
      country: kycDocument['country'],
      name: kycDocument['issuedBy'],
      issuingVersion: kycDocument['issueNumber'],
      city: kycDocument['placeOfIssue'],
    };
    return issuer;
  }

  formatPages(data: AnyRecord) {
    const documentImages: AnyRecord[] = [];
    for (const image of data.images as { context?: string; content: string }[]) {
      const tmpFile = tmp.fileSync().name;
      const base64ImageContent = image.content.split(',')[1];
      const data = Buffer.from(base64ImageContent as string, 'base64');
      fs.writeFileSync(tmpFile, data);

      documentImages.push({
        uri: tmpFile,
        provider: 'base64',
        type: 'png',
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

  setNestedProperty(obj: Record<string, any>, path: Array<string>, value: AnyRecord) {
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        current = current[path[i] as keyof typeof current];
      }
    }
  }
}

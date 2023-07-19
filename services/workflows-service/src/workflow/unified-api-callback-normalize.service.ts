import { Injectable } from '@nestjs/common';
import { EndUserRepository } from '@/end-user/end-user.repository';
import { BusinessRepository } from '@/business/business.repository';
import { StorageService } from '@/storage/storage.service';
import { FileService } from '@/providers/file/file.service';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { AnyRecord, DefaultContextSchema } from '@ballerine/common';
import { WorkflowHookQuery } from '@/workflow/dtos/workflow-hook-query';
import { UnifiedCallbackNames } from '@/workflow/types/unified-callback-names';
import { WorkflowService } from '@/workflow/workflow.service';
import { WorkflowRuntimeData } from '@prisma/client';
import { z } from 'zod';
import * as tmp from 'tmp';
import fs from 'fs';
import { HttpFileService } from '@/providers/file/file-provider/http-file.service';

@Injectable()
export class UnifiedApiCallbackNormalizeService {
  constructor(
    protected readonly endUserRepository: EndUserRepository,
    protected readonly businessRepository: BusinessRepository,
    protected readonly storageService: StorageService,
    protected readonly workflowService: WorkflowService,
    protected readonly fileService: FileService,
    private readonly logger: AppLoggerService,
  ) {}

  async normalizeHookCallback(
    workflowRuntime: WorkflowRuntimeData,
    data: AnyRecord,
    processName?: UnifiedCallbackNames,
  ) {
    if (processName === 'kyc-unified-api') {
      const kycData = await this.mapCallbackDataToIndividual(data, workflowRuntime);
      return kycData;
    }

    return data;
  }

  async mapCallbackDataToIndividual(data: AnyRecord, workflowRuntime: WorkflowRuntimeData) {
    const entity = workflowRuntime.context.entity;
    const kycDocument = data.document as AnyRecord;
    const document: Record<string, any> = {};

    const entityInformation = this.formatEntityData(data);
    const issuer = this.formatIssuerData(kycDocument, document);
    const documentProperties = this.formatDocumentProperties(data, kycDocument);
    const pages = this.formatPages(data);

    document['entity'] = entityInformation;
    document['issuer'] = issuer;
    document['category'] = 'kyc';
    // @ts-ignore
    document['decision'] = data.decision;
    document['decisionReason'] = data.reason;
    document['riskLabels'] = data.riskLabels;
    document['type'] = kycDocument.type;
    document['pages'] = pages;
    document['properties'] = documentProperties;

    const defaultContextSchema = await this.workflowService.copyFileAndCreate(
      { documents: [document] } as unknown as DefaultContextSchema,
      entity.id,
    );
    return defaultContextSchema;
  }
  private formatEntityData(data: AnyRecord) {
    const entityInformation: Record<string, any> = {};
    const person = data.person as AnyRecord;
    data['endUserType'] = 'individual';
    entityInformation['nationalId'] = person['idNumber'];
    entityInformation['firstName'] = person['firstName'];
    entityInformation['lastName'] = person['lastName'];
    entityInformation['dateOfBirth'] = person['dateOfBirth'];
    entityInformation['email'] = person['email'];
    entityInformation.additionalInfo = {};
    entityInformation.additionalInfo['gender'] = person['gender'];
    entityInformation.additionalInfo['nationality'] = person['nationality'];
    entityInformation.additionalInfo['yearOfBirth'] = person['yearOfBirth'];
    entityInformation.additionalInfo['placeOfBirth'] = person['placeOfBirth'];
    entityInformation.additionalInfo['pepSanctionMatch'] = person['pepSanctionMatch'];
    entityInformation.additionalInfo['addresses'] = person['addresses'];
    return entityInformation;
  }

  private formatIssuerData(kycDocument: AnyRecord, document: Record<string, any>) {
    const issuer: Record<string, any> = {};
    const issuerAdditional: Record<string, any> = {};
    issuerAdditional['validFrom'] = kycDocument['validFrom'];
    issuerAdditional['validUntil'] = kycDocument['validUntil'];
    issuerAdditional['placeOfIssue'] = kycDocument['placeOfIssue'];
    issuerAdditional['firstIssue'] = kycDocument['firstIssue'];
    issuerAdditional['issueNumber'] = kycDocument['issueNumber'];
    issuer['additionalDetails'] = issuerAdditional;
    issuer['country'] = kycDocument['country'];
    issuer['name'] = kycDocument['issuedBy'];
    return issuer;
  }

  formatPages(data: AnyRecord) {
    const documentImages = [];
    for (const image of data.images as { context?: string; content: string }[]) {
      const tmpFile = tmp.fileSync().name;
      const data = Buffer.from(image.content, 'base64');
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
    const properties: AnyRecord = {};
    const person = data.person as AnyRecord;
    properties['email'] = person['email'];
    properties['expiryDate'] = kycDocument['validUntil'];
    properties['idNumber'] = person['idNumber'];
    return properties;
  }
}

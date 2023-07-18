import { Injectable } from '@nestjs/common';
import { EndUserRepository } from '@/end-user/end-user.repository';
import { BusinessRepository } from '@/business/business.repository';
import { StorageService } from '@/storage/storage.service';
import { FileService } from '@/providers/file/file.service';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import {AnyRecord, DefaultContextSchema} from '@ballerine/common';
import {WorkflowHookQuery} from '@/workflow/dtos/workflow-hook-query';
import {UnifiedCallbackNames} from '@/workflow/types/unified-callback-names';
import {WorkflowService} from '@/workflow/workflow.service';

@Injectable()
export class WorkflowCallbackNormalizationService {
  constructor(
    protected readonly endUserRepository: EndUserRepository,
    protected readonly businessRepository: BusinessRepository,
    protected readonly storageService: StorageService,
    protected readonly workflowService: WorkflowService,
    protected readonly fileService: FileService,
    private readonly logger: AppLoggerService,
  ) {}

  async normalizeHookCallback(workflowRuntimeId: string, data: AnyRecord, processName: UnifiedCallbackNames){
    if (processName == 'kyc-unified-api') {
      const kycData = await this.mapCallbackDataToIndividual(data, workflowRuntimeId)
      return kycData
    }
  }

  async mapCallbackDataToIndividual(data: AnyRecord, workflowRuntimeId: string){
    const workflowService = await this.workflowService.getWorkflowRuntimeDataById(workflowRuntimeId);
    const entityId = workflowService.context.entityId;
    const entityInformation: Record<string, any> = {}
    const person = data.person as AnyRecord;

    data['endUserType'] = 'individual'
    entityInformation['nationalId'] = person['idNumber']
    entityInformation['firstName'] = person['firstName']
    entityInformation['lastName'] = person['lastName']
    entityInformation['dateOfBirth'] = person['dateOfBirth']
    entityInformation['email'] = person['email']
    entityInformation.additionalInfo = {}
    entityInformation.additionalInfo['gender'] = person['gender']
    entityInformation.additionalInfo['nationality'] = person['nationality']
    entityInformation.additionalInfo['yearOfBirth'] = person['yearOfBirth']
    entityInformation.additionalInfo['placeOfBirth'] = person['placeOfBirth']
    entityInformation.additionalInfo['pepSanctionMatch'] = person['pepSanctionMatch']
    entityInformation.additionalInfo['addresses'] = person['addresses']

    const document: Record<string, any> = {}
    const issuer: Record<string, any> = {}
    const issuerAdditional: Record<string, any> = {}
    const kycDocument = data.document;
    issuerAdditional['validFrom'] = kycDocument['validFrom']
    issuerAdditional['validUntil'] = kycDocument['validUntil']
    issuerAdditional['placeOfIssue'] = kycDocument['placeOfIssue']
    issuerAdditional['firstIssue'] = kycDocument['firstIssue']
    issuerAdditional['issueNumber'] = kycDocument['issueNumber']
    issuer['country'] = kycDocument['country']
    issuer['name'] = kycDocument['issuedBy']
    issuer['additionalDetails'] = issuerAdditional
    document['issuer'] = issuer
    document['category'] = 'kyc'
    document['type'] = kycDocument.type
    document['issuingVersion'] = kycDocument.number

    const pages = data.images.map(image => {
      return {
        uri: image.content,
        provider: 'base64',
        type: 'png',
        metadata: {
          side: image.context?.replace("document-",'')
        }
      }
    })
    const documents = [document]

    const defaultContextSchema = await this.workflowService.copyFileAndCreate(documents as unknown as DefaultContextSchema, entityId);
  }

  uploadEntity(data: AnyRecord){

  }
}

import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { fetchCompanyInformationPlugin } from './fetch-company-information.plugin';
import { fetchCompanyInformation } from '@/domains/collection-flow';
import { beforeEach, describe, it, vi } from 'vitest';
import { AnyObject } from '@ballerine/ui';

vi.mock('@/domains/collection-flow', async () => {
  const actual = await vi.importActual('@/domains/collection-flow');

  return {
    //@ts-ignore
    ...actual,
    fetchCompanyInformation: vi.fn(),
  };
});

describe('Fetch Company Information Plugin', () => {
  let mockedCompanyInformationData: any;
  let mockedEntity: any;
  let mockedContext: CollectionFlowContext;
  let mockedTransformedData: any;

  beforeEach(() => {
    mockedCompanyInformationData = {
      name: 'Test Company Ltd',
      companyNumber: '12345678',
      vat: 'GB123456789',
      numberOfEmployees: 42,
      companyType: 'Private Limited Company',
      currentStatus: 'Active',
      jurisdictionCode: 'gb',
      incorporationDate: '2020-01-01',
    };

    mockedTransformedData = {
      companyName: 'Test Company Ltd',
      taxIdentificationNumber: 'GB123456789',
      businessType: 'Private Limited Company',
      additionalInfo: {
        status: 'Active',
        incorporationDate: '2020-01-01',
        openCorporate: mockedCompanyInformationData,
      },
    };

    mockedEntity = {
      data: {
        registrationNumber: '12345678',
        country: 'GB',
        additionalInfo: {
          state: 'London',
        },
      },
    };

    mockedContext = {
      entity: mockedEntity,
    } as CollectionFlowContext;

    (fetchCompanyInformation as jest.Mock).mockResolvedValue(mockedCompanyInformationData);
  });

  describe('default params', () => {
    describe('when plugin execution is successful', () => {
      it('should add result to context', async () => {
        const result = (await fetchCompanyInformationPlugin(mockedContext, {} as any)) as AnyObject;

        expect(result.entity.data.companyName).toBe(mockedTransformedData.companyName);
        expect(result.entity.data.taxIdentificationNumber).toBe(
          mockedTransformedData.taxIdentificationNumber,
        );
        expect(result.entity.data.businessType).toBe(mockedTransformedData.businessType);
        expect(result.entity.data.additionalInfo).toMatchObject(
          mockedTransformedData.additionalInfo,
        );
      });
    });

    describe('when plugin execution fails', () => {
      it('should return original context', async () => {
        const result = (await fetchCompanyInformationPlugin(mockedContext, {} as any)) as AnyObject;

        expect(result).toMatchObject(mockedContext);
      });
    });
  });

  describe('with custom params', () => {
    describe('when plugin execution is successful', () => {
      it('should add result to context', async () => {
        const result = (await fetchCompanyInformationPlugin(mockedContext, {} as any, {
          output: 'some.other.place',
        })) as AnyObject;

        expect(result.some.other.place.companyName).toBe(mockedTransformedData.companyName);
        expect(result.some.other.place.taxIdentificationNumber).toBe(
          mockedTransformedData.taxIdentificationNumber,
        );
        expect(result.some.other.place.businessType).toBe(mockedTransformedData.businessType);
        expect(result.some.other.place.additionalInfo).toMatchObject(
          mockedTransformedData.additionalInfo,
        );
      });
    });

    describe('when plugin execution fails', () => {
      it('should return original context', async () => {
        const contextCopy = structuredClone(mockedContext);
        const result = (await fetchCompanyInformationPlugin(mockedContext, {} as any, {
          output: 'some.other.place',
        })) as AnyObject;

        expect(result).toMatchObject(contextCopy);
      });
    });
  });
});

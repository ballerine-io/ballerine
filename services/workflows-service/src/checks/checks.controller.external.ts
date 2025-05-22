import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { GetChecksDto } from './dto/get-checks.dto';
import { ChecksService } from './checks.service';
import { CurrentProject } from '@/common/decorators/current-project.decorator';
import type { TProjectId } from '@/types';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetKybAndOwnershipChecksDto } from './dto/get-kyb-and-ownership-checks.dto';
import { CreateCheckDto } from './dto/create-check.dto';

@common.Controller('external/checks')
@ApiBearerAuth()
@swagger.ApiTags('Checks')
export class ChecksControllerExternal {
  constructor(private readonly checksService: ChecksService) {}

  @common.Get()
  @swagger.ApiOperation({ summary: 'Get checks' })
  @swagger.ApiResponse({ status: 200, description: 'Successfully retrieved checks' })
  @swagger.ApiResponse({ status: 500, description: 'Internal server error' })
  getChecks(@common.Query() query: GetChecksDto) {
    return this.checksService.getChecks(query);
  }

  @common.Get('/kyb_and_ownership')
  @swagger.ApiOperation({ summary: 'Get KYB and ownership checks' })
  @swagger.ApiResponse({
    status: 200,
    description: 'Successfully retrieved KYB and ownership checks',
  })
  @swagger.ApiResponse({ status: 500, description: 'Internal server error' })
  getKybAndOwnershipChecks(
    @common.Query() query: GetKybAndOwnershipChecksDto,
    @CurrentProject() projectId: TProjectId,
  ) {
    // return this.checksService.getKybAndOwnershipChecks(query, projectId);
    return {
      data: [
        {
          id: 'veou49q78otyhl6kryscn6j8',
          createdAt: '2025-05-06T12:09:14.482Z',
          status: 'completed',
          type: 'kyb_and_ownership',
          sanctions: null,
          registryInformation: null,
          companyStructure: {
            createdAt: '2025-05-06T12:09:14.482Z',
            updatedAt: '2025-05-06T12:09:14.482Z',
            output: {
              edges: [
                {
                  id: 'e5a82692-8b72-463a-95b3-a9a1fdf5138c->84bdf19f-e354-40cc-8b6a-5a585f83e14b',
                  data: { sharePercentage: 100 },
                  source: 'e5a82692-8b72-463a-95b3-a9a1fdf5138c',
                  target: '84bdf19f-e354-40cc-8b6a-5a585f83e14b',
                },
              ],
              nodes: [
                {
                  id: 'e5a82692-8b72-463a-95b3-a9a1fdf5138c',
                  data: { name: '2 PAY PEOPLE LTD', type: 'COMPANY' },
                },
                {
                  id: '84bdf19f-e354-40cc-8b6a-5a585f83e14b',
                  data: { name: 'JUDITH SEYMOUR', type: 'PERSON', sharePercentage: 100 },
                },
              ],
            },
          },
        },
        {
          id: 'i90tv2tkdhkig9ih75e0vakw',
          createdAt: '2025-05-06T12:09:09.462Z',
          status: 'completed',
          type: 'kyb_and_ownership',
          sanctions: {
            createdAt: '2025-05-06T12:09:09.464Z',
            updatedAt: '2025-05-06T12:09:09.464Z',
            output: { data: [] },
          },
          registryInformation: {
            createdAt: '2025-05-06T12:09:12.531Z',
            updatedAt: '2025-05-06T12:09:12.531Z',
            output: {
              code: 200,
              data: {
                links: {
                  data: '/orders/3535334/download?format=json',
                  document: '/orders/3535334/download',
                },
                status: { original: 'active', normalized: 'Active' },
                capital: [
                  {
                    currency: 'GBP',
                    shareholdings: [
                      {
                        count: 2,
                        percentage: '50.00',
                        shareholders: {
                          individuals: [{ name: 'JUDITH SEYMOUR', type: 'Person', address: {} }],
                        },
                        totalNominalValue: 1,
                      },
                    ],
                    totalNominalValue: 2,
                  },
                ],
                addresses: [
                  {
                    city: 'Birmingham',
                    country: 'England',
                    postcode: 'B36 9DA',
                    streetName: 'Castle Bromwich',
                    fullAddress: '27 Chester Road, Castle Bromwich, Birmingham, England, B36 9DA',
                    buildingName: '27 Chester Road',
                  },
                ],
                legalForm: { original: 'ltd' },
                activities: [
                  {
                    code: '69201',
                    type: 'Primary',
                    description: 'Accounting and auditing activities',
                  },
                ],
                companyName: '2 PAY PEOPLE LTD',
                identifiers: { primaryRegistrationNumber: '11906892' },
                foundationDate: { original: '2019-03-26', normalized: '2019-03-26' },
                representatives: {
                  individuals: [
                    {
                      name: 'Judith Ann Seymour',
                      role: { original: 'Director' },
                      type: 'Person',
                      birthdate: { original: '1957-10-19', normalized: '1957-10-19' },
                      startDate: { original: '2019-03-26', normalized: '2019-03-26' },
                      nationality: 'British',
                      directorships: [
                        {
                          role: 'Director',
                          startDate: { original: '2019-03-26', normalized: '2019-03-26' },
                          companyName: '2 PAY PEOPLE LTD',
                          companyNumber: '11906892',
                        },
                        {
                          role: 'Director',
                          startDate: { original: '2015-03-23', normalized: '2015-03-23' },
                          companyName: '2VAT LADIES LTD',
                          companyNumber: '09503704',
                        },
                      ],
                      placeOfResidence: {
                        streetName: 'Castle Bromwich',
                        fullAddress: '27 Chester Road, Castle Bromwich, Birmingham',
                        buildingName: '27 Chester Road',
                        municipality: 'Birmingham',
                      },
                    },
                  ],
                },
                registrationAuthority: 'Companies House, United Kingdom',
                ultimateBeneficialOwners: {
                  individuals: [
                    {
                      name: 'Mrs Anne Lesley Moffat',
                      type: 'Person',
                      endDate: { original: '2023-02-13', normalized: '2023-02-13' },
                      birthdate: { original: '1955-08', normalized: '1955-08-01' },
                      nationality: 'British',
                      notifiedDate: { original: '2019-03-26', normalized: '2019-03-26' },
                      natureOfControl: [
                        'Ownership of shares – More than 25% but not more than 50%',
                        'Ownership of voting rights - More than 25% but not more than 50%',
                        'Right to appoint and remove directors',
                      ],
                      placeOfResidence: {
                        city: 'Birmingham',
                        country: 'England',
                        postcode: 'B36 9DA',
                        streetName: 'Castle Bromwich',
                        fullAddress: 'Chester Road, Castle Bromwich, Birmingham, England, B36 9DA',
                        buildingName: 'Chester Road',
                      },
                    },
                    {
                      name: 'Mrs Judith Ann Seymour',
                      type: 'Person',
                      birthdate: { original: '1957-10', normalized: '1957-10-01' },
                      nationality: 'British',
                      notifiedDate: { original: '2019-03-26', normalized: '2019-03-26' },
                      natureOfControl: [
                        'Ownership of shares – More than 25% but not more than 50%',
                        'Ownership of voting rights - More than 25% but not more than 50%',
                        'Right to appoint and remove directors',
                      ],
                      placeOfResidence: {
                        city: 'Birmingham',
                        country: 'England',
                        postcode: 'B36 9DA',
                        streetName: 'Castle Bromwich',
                        fullAddress: 'Chester Road, Castle Bromwich, Birmingham, England, B36 9DA',
                        buildingName: 'Chester Road',
                      },
                    },
                  ],
                },
              },
              orderId: '3535334',
              jurisdictionCode: 'GB',
            },
          },
          companyStructure: {
            createdAt: '2025-05-06T12:09:12.533Z',
            updatedAt: '2025-05-06T12:09:12.533Z',
            output: { code: 200001, orderId: '3535336' },
          },
        },
        {
          id: 'm9s2spy08d24tjzpaxxuo532',
          createdAt: '2025-05-06T11:33:09.027Z',
          status: 'completed',
          type: 'kyb_and_ownership',
          sanctions: {
            createdAt: '2025-05-06T11:33:09.030Z',
            updatedAt: '2025-05-06T11:33:09.030Z',
            output: { data: [] },
          },
          registryInformation: {
            createdAt: '2025-05-06T11:33:16.149Z',
            updatedAt: '2025-05-06T11:33:16.149Z',
            output: {
              code: 200,
              data: {
                links: {
                  data: '/orders/3535081/download?format=json',
                  document: '/orders/3535081/download',
                },
                status: { original: 'active', normalized: 'Active' },
                capital: [
                  {
                    currency: 'GBP',
                    shareholdings: [
                      {
                        count: 2,
                        percentage: '50.00',
                        shareholders: {
                          individuals: [{ name: 'JUDITH SEYMOUR', type: 'Person', address: {} }],
                        },
                        totalNominalValue: 1,
                      },
                    ],
                    totalNominalValue: 2,
                  },
                ],
                addresses: [
                  {
                    city: 'Birmingham',
                    country: 'England',
                    postcode: 'B36 9DA',
                    streetName: 'Castle Bromwich',
                    fullAddress: '27 Chester Road, Castle Bromwich, Birmingham, England, B36 9DA',
                    buildingName: '27 Chester Road',
                  },
                ],
                legalForm: { original: 'ltd' },
                activities: [
                  {
                    code: '69201',
                    type: 'Primary',
                    description: 'Accounting and auditing activities',
                  },
                ],
                companyName: '2 PAY PEOPLE LTD',
                identifiers: { primaryRegistrationNumber: '11906892' },
                foundationDate: { original: '2019-03-26', normalized: '2019-03-26' },
                representatives: {
                  individuals: [
                    {
                      name: 'Judith Ann Seymour',
                      role: { original: 'Director' },
                      type: 'Person',
                      birthdate: { original: '1957-10-19', normalized: '1957-10-19' },
                      startDate: { original: '2019-03-26', normalized: '2019-03-26' },
                      nationality: 'British',
                      directorships: [
                        {
                          role: 'Director',
                          startDate: { original: '2019-03-26', normalized: '2019-03-26' },
                          companyName: '2 PAY PEOPLE LTD',
                          companyNumber: '11906892',
                        },
                        {
                          role: 'Director',
                          startDate: { original: '2015-03-23', normalized: '2015-03-23' },
                          companyName: '2VAT LADIES LTD',
                          companyNumber: '09503704',
                        },
                      ],
                      placeOfResidence: {
                        streetName: 'Castle Bromwich',
                        fullAddress: '27 Chester Road, Castle Bromwich, Birmingham',
                        buildingName: '27 Chester Road',
                        municipality: 'Birmingham',
                      },
                    },
                  ],
                },
                registrationAuthority: 'Companies House, United Kingdom',
                ultimateBeneficialOwners: {
                  individuals: [
                    {
                      name: 'Mrs Anne Lesley Moffat',
                      type: 'Person',
                      endDate: { original: '2023-02-13', normalized: '2023-02-13' },
                      birthdate: { original: '1955-08', normalized: '1955-08-01' },
                      nationality: 'British',
                      notifiedDate: { original: '2019-03-26', normalized: '2019-03-26' },
                      natureOfControl: [
                        'Ownership of shares – More than 25% but not more than 50%',
                        'Ownership of voting rights - More than 25% but not more than 50%',
                        'Right to appoint and remove directors',
                      ],
                      placeOfResidence: {
                        city: 'Birmingham',
                        country: 'England',
                        postcode: 'B36 9DA',
                        streetName: 'Castle Bromwich',
                        fullAddress: 'Chester Road, Castle Bromwich, Birmingham, England, B36 9DA',
                        buildingName: 'Chester Road',
                      },
                    },
                    {
                      name: 'Mrs Judith Ann Seymour',
                      type: 'Person',
                      birthdate: { original: '1957-10', normalized: '1957-10-01' },
                      nationality: 'British',
                      notifiedDate: { original: '2019-03-26', normalized: '2019-03-26' },
                      natureOfControl: [
                        'Ownership of shares – More than 25% but not more than 50%',
                        'Ownership of voting rights - More than 25% but not more than 50%',
                        'Right to appoint and remove directors',
                      ],
                      placeOfResidence: {
                        city: 'Birmingham',
                        country: 'England',
                        postcode: 'B36 9DA',
                        streetName: 'Castle Bromwich',
                        fullAddress: 'Chester Road, Castle Bromwich, Birmingham, England, B36 9DA',
                        buildingName: 'Chester Road',
                      },
                    },
                  ],
                },
              },
              orderId: '3535081',
              jurisdictionCode: 'GB',
            },
          },
          companyStructure: null,
        },
        {
          id: 'jf57rxxxo1wya7bb8zb65bui',
          createdAt: '2025-05-06T11:17:26.341Z',
          status: 'completed',
          type: 'kyb_and_ownership',
          sanctions: {
            createdAt: '2025-05-06T11:17:26.346Z',
            updatedAt: '2025-05-06T11:17:26.346Z',
            output: { data: [] },
          },
          registryInformation: {
            createdAt: '2025-05-06T11:17:29.586Z',
            updatedAt: '2025-05-06T11:17:29.586Z',
            output: null,
          },
          companyStructure: null,
        },
        {
          id: 'jpqvfdm30ubomrvop9ej1cvl',
          createdAt: '2025-05-06T11:03:35.111Z',
          status: 'completed',
          type: 'kyb_and_ownership',
          sanctions: {
            createdAt: '2025-05-06T11:03:35.116Z',
            updatedAt: '2025-05-06T11:03:35.116Z',
            output: { data: [] },
          },
          registryInformation: {
            createdAt: '2025-05-06T11:03:42.694Z',
            updatedAt: '2025-05-06T11:03:42.694Z',
            output: null,
          },
          companyStructure: null,
        },
      ],
      totalItems: 5,
      totalPages: 1,
    };
  }

  @common.Post('')
  @swagger.ApiOperation({ summary: 'Create KYB and ownership check' })
  @swagger.ApiResponse({ status: 201, description: 'Successfully created KYB and ownership check' })
  @swagger.ApiResponse({ status: 500, description: 'Internal server error' })
  createKybAndOwnershipCheck(
    @common.Body() body: CreateCheckDto,
    @CurrentProject() projectId: TProjectId,
  ) {
    return this.checksService.createCheck(body, projectId);
  }
}

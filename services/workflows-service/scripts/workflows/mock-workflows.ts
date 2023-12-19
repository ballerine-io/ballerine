import { faker } from '@faker-js/faker';
import { Workflow } from './workflow-runtime';

export const workflows = (): Workflow[] => {
  return [
    {
      business: {
        id: faker.datatype.uuid(),
        name: 'ElektroTech GmbH',
        registrationNumber: 'HRB 987654',
        legalForm: 'Gesellschaft mit beschränkter Haftung (GmbH)',
        countryOfIncorporation: 'Germany',
        dateOfIncorporation: new Date('2018-02-20'),
        address: 'Technologiepark 5, 76131 Karlsruhe, Baden-Württemberg',
        addressComponents: {
          country: 'Germany',
          locality: 'Karlsruhe',
          postalCode: '76131',
          region: 'Baden-Württemberg',
          streetAddress: 'Technologiepark 5',
        },
        jurisdictionCode: 'DE',
        proofOfAddressIssuerCountry: 'Germany',
        proofOfAddress:
          'https://simple-kyb-demo.s3.eu-central-1.amazonaws.com/mock-data/ElektroTech+GmbH/utility+bill2.jpeg',
        registrationCertificate:
          'https://simple-kyb-demo.s3.eu-central-1.amazonaws.com/mock-data/ElektroTech+GmbH/COI1.jpeg',
        companyStructure:
          'https://simple-kyb-demo.s3.eu-central-1.amazonaws.com/mock-data/ElektroTech+GmbH/company+structure.png',
        bankStatement:
          'https://simple-kyb-demo.s3.eu-central-1.amazonaws.com/mock-data/ElektroTech+GmbH/Bank+Statement1.jpeg',
        bankInformation: {
          holder: 'ElektroTech GmbH',
          country: 'Germany',
          currency: 'EUR',
          bankName: 'Deutsche Bank',
          account: Number(faker.random.numeric(10)),
        },
        companyActivity: {
          model: 'we manufacture electronic products.',
          transactionValue: 50,
          volumeAmount: 500000,
        },
        phoneNumber: '+49 721 909090',
        email: 'info@elektrotech.de',
        website: 'www.elektrotech.de',
        industry: 'Elektronics Manufacturing',
        taxIdentificationNumber: 'DE123456789',
        vatNumber: 'DE987654321',
        numberOfEmployees: 80,
        businessPurpose: 'Herstellung und Vertrieb von Elektronikprodukten.',
        shareholderStructure: [
          {
            name: 'Max Müller',
            ownershipPercentage: 70,
          },
        ],
      },
      ubos: [
        {
          id: faker.datatype.uuid(),
          nationalId: faker.random.numeric(10),
          decision: 'approved',
          decisionReason: null,
          withAml: false,
          nationality: 'DE',
          gender: 'M',
          title: faker.name.jobTitle(),
          firstName: 'Max',
          lastName: 'Müller',
          email: 'max.mueller@email.de',
          phoneNumber: '+49721909091',
          dateOfBirth: new Date('1980-08-15'),
          avatarUrl:
            'https://simple-kyb-demo.s3.eu-central-1.amazonaws.com/mock-data/ElektroTech+GmbH/Nitzan_selfie_with_a_low_quality_camera_50ea035b-05fd-4e21-af97-19523210dc5a.png',
          selfie:
            'https://simple-kyb-demo.s3.eu-central-1.amazonaws.com/mock-data/ElektroTech+GmbH/Nitzan_selfie_with_a_low_quality_camera_50ea035b-05fd-4e21-af97-19523210dc5a.png',
          passport: {
            front:
              'https://simple-kyb-demo.s3.eu-central-1.amazonaws.com/mock-data/ElektroTech+GmbH/Germany_ID_front.png',
            back: 'https://simple-kyb-demo.s3.eu-central-1.amazonaws.com/mock-data/ElektroTech+GmbH/Germany_ID_bak.png',
            issuerCountryCode: 'DE',
          },
        },
      ],
    },
  ];
};

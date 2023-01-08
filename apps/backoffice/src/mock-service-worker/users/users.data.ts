import { IUser } from './interfaces';
import { faker } from '@faker-js/faker';
import { EState } from './enums';

const mockDocumentSets = [
  [
    {
      url: '/images/mock-documents/set_1_doc_front.png',
      doctype: 'ID Document (Front)',
    },
    {
      url: '/images/mock-documents/set_1_doc_back.png',
      doctype: 'ID Document (Back)',
    },
    {
      url: '/images/mock-documents/set_1_selfie.png',
      doctype: 'Selfie',
    },
    {
      url: '/images/mock-documents/set_1_doc_face.png',
      doctype: 'ID Document (Face)',
    },
  ],
  [
    {
      url: '/images/mock-documents/set_2_doc_front.png',
      doctype: 'ID Document (Front)',
    },
    {
      url: '/images/mock-documents/set_2_selfie.png',
      doctype: 'Selfie',
    },
    {
      url: '/images/mock-documents/set_2_doc_face.png',
      doctype: 'ID Document (Face)',
    },
  ],
  [
    {
      url: '/images/mock-documents/set_3_doc_front.png',
      doctype: 'ID Document (Front)',
    },
    {
      url: '/images/mock-documents/set_3_doc_back.png',
      doctype: 'ID Document (Back)',
    },
    {
      url: '/images/mock-documents/set_3_selfie.png',
      doctype: 'Selfie',
    },
    {
      url: '/images/mock-documents/set_3_doc_face.png',
      doctype: 'ID Document (Face)',
    },
  ],
];

// eslint-disable-next-line
export let data = {
  users: Array.from({ length: 100 }, (): IUser => {
    const first_name = faker.name.firstName();
    const last_name = faker.name.lastName();
    const country = faker.address.country();
    const generateState = () => faker.helpers.arrayElement(Object.values(EState).filter(state => state !== EState.NEW));
    const state = faker.helpers.arrayElement(Object.values(EState));

    return {
      id: faker.datatype.uuid(),
      client_id: faker.datatype.uuid(),
      correlation_id: faker.datatype.uuid(),
      created_by: faker.name.firstName(),
      updated_by: faker.name.firstName(),
      json_data: {},
      created_at: faker.date.recent(0.02).toISOString(),
      updated_at: faker.date.past().toISOString(),
      additional_info: {},
      first_name,
      middle_name: faker.name.firstName(),
      last_name,
      enduser_type: faker.helpers.arrayElement(['individual', 'business']),
      state_reason: null,
      email: faker.internet.email(first_name, last_name),
      phone: faker.phone.number('+###########'),
      state,
      latest_verification_id: faker.datatype.uuid(),
      date_of_birth: faker.date.past(50).toISOString(),
      place_of_birth: country,
      sex: faker.helpers.arrayElement(['male', 'female', 'other']),
      assigned_to: Math.random() > 0.75 ? faker.image.avatar() : '',
      passport: {
        type: faker.helpers.arrayElement(['american passport', 'canadian passport']),
        authority: `${country} department of state`,
        place_of_issue: `${faker.address.state()}, ${country}`,
        date_of_issue: faker.date.past(10).toISOString(),
        expires: faker.date.future(10).toISOString(),
      },
      check_results: {
        final_result: state,
        aml_check: generateState(),
        id_check: generateState(),
        selfie_check: generateState(),
        scanned_by: 'IDV Vendor',
      },
      address: {
        city: faker.address.city(),
        country,
        street: faker.address.streetAddress().replace(/\d/g, '').trim(),
        house_num: faker.datatype.number({ min: 1, max: 100 }).toString(),
        apt_num: faker.datatype.number({ min: 1, max: 100 }).toString(),
        zip_code: faker.address.zipCode(),
      },
      documents: mockDocumentSets[Math.floor(Math.random() * mockDocumentSets.length)],
    };
  }),
};

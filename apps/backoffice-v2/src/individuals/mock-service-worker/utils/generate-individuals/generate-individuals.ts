import { faker } from '@faker-js/faker';

export const clientId = crypto.randomUUID();
export const avatarUrl = faker.image.avatar();
export const assignedTo = faker.image.avatar();

export const generateIndividuals = (length: number) => {
  return Array.from({ length }, _ => {
    const generateState = ({
      withNew = false,
    }: {
      withNew?: boolean;
    } = {}) =>
      faker.helpers.arrayElement([
        'APPROVED',
        'REJECTED',
        'PROCESSING',
        ...(withNew ? ['NEW'] : []),
      ]);
    // Should display a placeholder for now.
    const avatarUrl = undefined;
    const id = crypto.randomUUID();
    const sex = faker.helpers.arrayElement(['male', 'female', 'other']);
    const noOtherSex = sex === 'other' ? undefined : (sex as 'male' | 'female');
    const endUserType = faker.helpers.arrayElement(['individual', 'business']);
    const firstName = faker.name.firstName(noOtherSex);
    const lastName = faker.name.lastName(noOtherSex);
    const middleName = faker.name.middleName(noOtherSex);
    const email = faker.internet.email(firstName, lastName);
    const phone = faker.phone.number('+##########');
    const createdAt = faker.date.recent(1);
    const fullName = `${firstName} ${middleName} ${lastName}`;
    const dateOfBirth = faker.date.past(60);

    const address = {
      country: faker.address.country(),
      approvalState: faker.address.state(),
      city: faker.address.city(),
      street: faker.address.streetAddress(),
      houseNum: faker.random.numeric(),
      aptNum: faker.random.numeric(),
      zipcode: faker.address.zipCode(),
    };
    const passport = {
      type: faker.helpers.arrayElement(['American passport', 'Canadian ID']),
      authority: `${address?.country} department of state`,
      placeOfIssue: `${address?.state}, ${address?.country}`,
      dateOfIssue: faker.date.past(10),
      expires: faker.date.future(10),
    };

    const amlCheck = generateState();
    const approvalState = generateState({
      withNew: true,
    });
    const checkResults = {
      finalResult: approvalState,
      amlCheck,
      idCheck: generateState(),
      selfieCheck: generateState(),
      scannedBy: 'IDV vendor',
    };

    const documents = faker.helpers.arrayElement([
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
    ]);

    return {
      id,
      clientId,
      avatarUrl,
      createdAt,
      firstName,
      middleName,
      lastName,
      fullName,
      endUserType,
      email,
      phone,
      approvalState,
      dateOfBirth,
      placeOfBirth: address?.country,
      sex,
      assignedTo: Math.random() > 0.5 ? assignedTo : undefined,
      passport,
      checkResults,
      address,
      documents,
    };
  });
};

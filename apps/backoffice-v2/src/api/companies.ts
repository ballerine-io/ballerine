export const companies = {
  list: async (filterId: string) => {
    return Promise.resolve([
      {
        id: '1',
        firstName: 'Inc.',
        lastName: 'Inc.',
        createdAt: new Date().toISOString(),
        assignedTo: '',
        avatarUrl: '',
        state: 'APPROVED',
        website: 'https://www.fake.com',
        companyType: 'Reg. Corp.',
      },
      {
        id: '2',
        firstName: 'Not Inc.',
        lastName: 'Not Inc.',
        createdAt: new Date().toISOString(),
        assignedTo: '',
        avatarUrl: '',
        state: 'REJECTED',
        website: 'https://www.fake1.com',
        companyType: 'S-Corp',
      },
      {
        id: '3',
        firstName: 'Not Inc. 2',
        lastName: 'Not Inc. 2',
        createdAt: new Date().toISOString(),
        assignedTo: '',
        avatarUrl: '',
        state: 'PROCESSING',
        website: 'https://www.fake2.com',
        companyType: 'LLC',
      },
    ]);
  },
  byId: async (companyId: string) => {
    return Promise.resolve({
      id: '1',
      firstName: 'Inc.',
      lastName: 'Inc.',
      createdAt: new Date().toISOString(),
      assignedTo: '',
      avatarUrl: '',
      state: 'APPROVED',
      website: 'https://www.fake.com',
      companyType: 'Reg. Corp.',
    });
  },
};

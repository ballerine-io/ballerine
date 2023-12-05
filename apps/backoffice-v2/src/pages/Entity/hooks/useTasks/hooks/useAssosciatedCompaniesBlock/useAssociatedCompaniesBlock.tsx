import { useMemo } from 'react';

export const useAssociatedCompaniesBlock = (
  associatedCompanies: Array<{
    companyName: string;
    registrationNumber: string;
    registeredCountry: string;
    relationship: string;
    contactPerson: string;
    contactEmail: string;
  }>,
) => {
  const transformedAssociatedCompanies = useMemo(
    () =>
      associatedCompanies?.map(associatedCompany => ({
        companyName: associatedCompany.companyName,
        registrationNumber: associatedCompany.registrationNumber,
        registeredCountry: associatedCompany.registeredCountry,
        relationship: associatedCompany.relationship,
        contactPerson: associatedCompany.contactPerson,
        contactEmail: associatedCompany.contactEmail,
      })),
    [associatedCompanies],
  );

  if (!Array.isArray(transformedAssociatedCompanies) || !transformedAssociatedCompanies?.length)
    return [];

  return [
    {
      cells: [
        {
          type: 'container',
          value: [
            {
              type: 'heading',
              value: 'Associated Companies',
            },
            {
              type: 'subheading',
              value: 'User-Provided Data',
              props: {
                className: 'mb-4',
              },
            },
            {
              type: 'container',
              value: transformedAssociatedCompanies?.flatMap(associatedCompany => [
                {
                  type: 'subheading',
                  value: 'Company Name',
                  props: {
                    className: 'text-lg my-4 block',
                  },
                },
                {
                  type: 'table',
                  value: {
                    columns: [
                      {
                        accessorKey: 'registrationNumber',
                        header: 'Registration number',
                      },
                      {
                        accessorKey: 'registeredCountry',
                        header: 'Registered Country',
                      },
                      {
                        accessorKey: 'relationship',
                        header: 'Relationship',
                      },
                      {
                        accessorKey: 'contactPerson',
                        header: 'Contact Person',
                      },
                      {
                        accessorKey: 'contactEmail',
                        header: 'Contact Email',
                      },
                    ],
                    data: [associatedCompany],
                  },
                },
              ]),
            },
          ],
        },
      ],
    },
  ];
};

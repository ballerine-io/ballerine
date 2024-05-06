import { faker } from '@faker-js/faker';
import { PrismaClient, Project } from '@prisma/client';

const seedFiles = async (prisma: PrismaClient, project: Project) => {
  const files = await Promise.all(
    new Array(3).fill(null).map((_, index) => {
      return prisma.file.create({
        data: {
          fileNameOnDisk: faker.image.cats(),
          uri: faker.image.cats(),
          userId: '',
          projectId: project.id,
        },
      });
    }),
  );

  return files.map(file => file.id);
};

export const seedBusinessReports = async (
  prisma: PrismaClient,
  { businessRiskIds, project }: { businessRiskIds: string[]; project: Project },
) => {
  const fileIds = await seedFiles(prisma, project);
  const arr = businessRiskIds
    .map(businessRiskId =>
      fileIds.map(fileId =>
        prisma.businessReport.create({
          data: {
            businessId: businessRiskId,
            report: {
              data: {},
              reportFileId: fileId,
              reportId: faker.datatype.uuid(),
            },
            projectId: project.id,
            type: 'ONGOING_MERCHANT_REPORT_T1',
          },
        }),
      ),
    )
    .flat(0);

  await Promise.all(
    businessRiskIds
      .map(businessRiskId =>
        fileIds.map(fileId =>
          prisma.businessReport.create({
            data: {
              businessId: businessRiskId,
              report: {
                data: {},
                reportFileId: fileId,
                reportId: faker.datatype.uuid(),
              },
              projectId: project.id,
              type: 'ONGOING_MERCHANT_REPORT_T1',
            },
          }),
        ),
      )
      .flat(1),
  );
};

import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { ApiBearerAuth } from '@nestjs/swagger';
import * as errors from '@/errors';
import { PrismaService } from '@/prisma/prisma.service';
import { UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from '@/common/guards/admin-auth.guard';

@ApiBearerAuth()
@swagger.ApiTags('Business Reports')
@common.Controller('external/business-reports')
@swagger.ApiExcludeController()
export class BusinessReportControllerExternal {
  constructor(private readonly prisma: PrismaService) {}

  @common.Get()
  @UseGuards(AdminAuthGuard)
  @swagger.ApiOkResponse({ type: [String] })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async list() {
    return await this.prisma.businessReport.findMany({
      include: {
        project: {
          include: {
            customer: true,
          },
        },
      },
    });
  }
}

import * as common from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserModel } from './user.model';
import { UserCreateDto } from '@/user/dtos/user-create';
import { AdminAuthGuard } from '@/common/guards/admin-auth.guard';
import { ProjectIds } from '@/common/decorators/project-ids.decorator';
import type { TProjectId, TProjectIds } from '@/types';
import { CurrentProject } from '@/common/decorators/current-project.decorator';
import { UserStatus } from '@prisma/client';
import sgMail from '@sendgrid/mail';
import { env } from '@/env';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';

@swagger.ApiExcludeController()
@common.Controller('internal/users')
@swagger.ApiExcludeController()
export class UserControllerInternal {
  constructor(protected readonly service: UserService, private logger: AppLoggerService) {}

  @common.Get()
  @swagger.ApiQuery({ name: 'projectId', type: String })
  @swagger.ApiOkResponse({ type: [UserModel] })
  @swagger.ApiForbiddenResponse()
  async list(
    @ProjectIds() projectIds: TProjectIds,
    @common.Query('projectId') projectId: string,
  ): Promise<UserModel[]> {
    return this.service.list(
      {
        where: { status: UserStatus.Active },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          avatarUrl: true,
          updatedAt: true,
          createdAt: true,
        },
      },
      projectId ? [projectId] : projectIds,
    );
  }

  @common.Post()
  @swagger.ApiCreatedResponse({ type: [UserModel] })
  @UseGuards(AdminAuthGuard)
  @swagger.ApiForbiddenResponse()
  async create(
    @common.Body() userCreatInfo: UserCreateDto,
    @CurrentProject() currentProjectId: TProjectId,
  ) {
    const { projectIds, options, ...userInfo } = userCreatInfo;

    const createdUser = await this.service.create(
      {
        data: userInfo,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          roles: true,
          workflowRuntimeData: true,
        },
      },
      projectIds?.[0] || currentProjectId,
    );

    if (!options?.sendWelcomeEmail) {
      return createdUser;
    }

    const message: sgMail.MailDataRequired = {
      to: createdUser.email,
      from: 'no-reply@ballerine.com',
      subject: 'Welcome Message!',
      text: 'Welcome to our Ballerine!',
      html: '<strong>Welcome to our Ballerine!</strong>',
    };

    if (!env.SENDGRID_API_KEY) {
      this.logger.warn('SendGrid API key not provided. Email will not be not send ');
      this.logger.log('Email:', message);

      return createdUser;
    }

    try {
      sgMail.setApiKey(env.SENDGRID_API_KEY);
      await sgMail.send(message);
    } catch (error) {
      console.error(error);
    }

    return createdUser;
  }
}

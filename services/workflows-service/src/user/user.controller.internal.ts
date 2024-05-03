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
      subject: "Your Ballerine's Case Management System Credentials",
      text: `
      Dear ${userInfo.firstName} ${userInfo.lastName},

        Welcome to the team! We are excited to have you on our system. To get you started, we have created your account for our Case Management System, which you will need to access to manage your tasks and collaborate with the team.
      
        To access your account:
      
        URL: ${env.BACKOFFICE_CORS_ORIGIN}
        Email: ${userInfo.email}
        Password: ${userInfo.password}
      
        If you encounter any issues accessing your account or have any questions, please do not hesitate to reach out to Ballerine's team.
      
        Best regards,
        Ballerine's Team`,
      html: `
      <body>
        <p>Dear ${userInfo.firstName} ${userInfo.lastName},</p>
    
        <p>Welcome to the team! We are excited to have you on our system. To get you started, we have created your account for our Case Management System, which you will need to access to manage your tasks and collaborate with the team.</p>
    
        <p><strong>To access your account:</strong></p>
        <ul>
          <li><strong>URL:</strong> ${env.BACKOFFICE_CORS_ORIGIN}</li>
          <li><strong>Email:</strong> ${userInfo.email}</li>
          <li><strong>Password:</strong> ${userInfo.password}</li>
        </ul>
    
        <p>If you encounter any issues accessing your account or have any questions, please do not hesitate to reach out to Ballerine's team.</p>
    
        <p>Best regards,<br>
        Ballerine's Team</p>
      </body>`,
    };

    if (!env.SENDGRID_API_KEY) {
      this.logger.warn('SendGrid API key not provided. Email will not be not send ');
      this.logger.log('Email:', message);

      return createdUser;
    }

    try {
      sgMail.setApiKey(env.SENDGRID_API_KEY);
      await sgMail.send(message);
    } catch (error: unknown) {
      this.logger.error(`Error Sending mail with Sendgrid: ${error}`);
    }

    return createdUser;
  }
}

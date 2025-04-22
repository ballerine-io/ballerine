import * as common from '@nestjs/common';
import { Controller, HttpCode, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';
import { UserModel } from '@/user/user.model';
import type { Request, Response } from 'express';
import { LocalAuthGuard } from '@/auth/local/local-auth.guard';
import { MagicLinkGuard } from '@/auth/magic-link/magic-link.guard';
import util from 'util';
import { Public } from '@/common/decorators/public.decorator';
import type { AuthenticatedEntity, TProjectId } from '@/types';
import type { User } from '@prisma/client';
import { AnalyticsService, EventNamesMap } from '@/common/analytics-logger/analytics.service';
import { UserData } from '@/user/user-data.decorator';
import { CustomerService } from '@/customer/customer.service';
import { CurrentProject } from '@/common/decorators/current-project.decorator';
import { UserService } from '@/user/user.service';

@Public()
@ApiTags('Auth')
@Controller('internal/auth')
@swagger.ApiExcludeController()
export class AuthController {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly customerService: CustomerService,
    private readonly userService: UserService,
  ) {}

  @common.UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(
    @Req() req: Request,
    @UserData() authenticatedEntity: User,
  ): Promise<{ user: Express.User | undefined }> {
    const { userToProjects } = await this.userService.getByIdUnscoped(authenticatedEntity.id, {
      select: { userToProjects: { select: { projectId: true } } },
    });

    if (!userToProjects || !userToProjects.length || !userToProjects[0]?.projectId) {
      throw new UnauthorizedException();
    }

    const { id: customerId } = await this.customerService.getByProjectId(
      userToProjects[0].projectId,
      { select: { id: true } },
    );

    void this.analyticsService.trackSafe({
      event: EventNamesMap.USER_LOGIN,
      distinctId: authenticatedEntity.id,
      properties: {
        customerId,
        email: authenticatedEntity.email,
      },
      customerId,
    });

    return { user: req.user };
  }

  @common.UseGuards(MagicLinkGuard)
  @Post('magic-link-login')
  @HttpCode(200)
  async loginViaMagicLink(
    @Req() req: Request,
    @UserData() authenticatedEntity: User,
    @CurrentProject() projectId: TProjectId,
  ): Promise<{ user: Express.User | undefined }> {
    const { id: customerId } = await this.customerService.getByProjectId(projectId, {
      select: { id: true },
    });

    void this.analyticsService.trackSafe({
      event: EventNamesMap.USER_MAGIC_LINK_LOGIN,
      distinctId: authenticatedEntity.id,
      properties: {
        customerId,
        email: authenticatedEntity.email,
      },
      customerId,
    });

    return { user: req.user };
  }

  @Post('logout')
  @HttpCode(200)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ user: undefined }> {
    const asyncLogout = util.promisify(req.logout.bind(req));
    await asyncLogout();
    res.clearCookie('session');
    res.clearCookie('session.sig');

    return { user: undefined };
  }

  @common.Get('session')
  @swagger.ApiOkResponse({ type: UserModel })
  getSession(@Req() req: Request): {
    user: Partial<User> | undefined;
  } {
    return {
      user: (req?.user as unknown as AuthenticatedEntity)?.user,
    };
  }
}

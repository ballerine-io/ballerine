import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { UserService } from '@/user/user.service';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request, Response } from 'express';

@Injectable()
export class UserSessionAuditMiddleware implements NestMiddleware {
  private FIVE_MINUTES_IN_MS = 1000 * 60 * 5;
  UPDATE_INTERVAL = this.FIVE_MINUTES_IN_MS;

  constructor(
    private readonly logger: AppLoggerService,
    private readonly userService: UserService,
  ) {}

  async use(req: Request, res: Response, next: (error?: any) => void) {
    if (req.session && req.user) {
      if (this.isUpdateCanBePerformed((req.user as User).lastActiveAt)) {
        await this.trackAuthorizedAction(req.user as User);
      }
    }

    next();
  }

  private isUpdateCanBePerformed(
    lastUpdate: Date | null,
    updateIntervalInMs: number = this.UPDATE_INTERVAL,
  ) {
    if (!lastUpdate) return true;

    const now = Date.now();
    const pastDate = Number(new Date(lastUpdate));

    return now - pastDate >= updateIntervalInMs;
  }

  private async trackAuthorizedAction(user: User, activeDate = new Date()) {
    this.logger.log(`Updating user presence`, { userId: user.id });
    await this.userService.updateById(user.id, { data: { lastActiveAt: activeDate } });
    this.logger.log(`Updated user presence`, { userId: user.id });
  }
}

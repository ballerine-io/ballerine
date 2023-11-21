import { PassportSerializer } from '@nestjs/passport';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { isRecordNotFoundError } from '@/prisma/prisma.util';
import { AuthenticatedEntity, TExpires, UserWithProjects } from '@/types';

export class SessionSerializer extends PassportSerializer {
  constructor(@Inject('USER_SERVICE') private readonly userService: UserService) {
    super();
  }

  serializeUser(
    user: UserWithProjects,
    done: (err: unknown, user: AuthenticatedEntity & TExpires) => void,
  ) {
    const date = new Date();
    // TODO: extract from config
    date.setTime(date.getTime() + 1 * 60 * 1000); // 1m
    // date.setTime(date.getTime() + 1 * 60 * 60 * 1000); // 1h

    done(null, {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      expires: date,
      type: 'user',
    });
  }

  async deserializeUser(
    user: AuthenticatedEntity & TExpires,
    done: (err: unknown, user: AuthenticatedEntity | null) => void,
  ) {
    try {
      if (!user.expires) {
        return done(new UnauthorizedException('Session missed expires property'), null);
      } else if (new Date(user.expires) < new Date()) {
        return done(new UnauthorizedException(`Session has expired`), null);
      }

      const userResult = await this.userService.getByIdUnscoped(user.user!.id!, {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
          userToProjects: { select: { projectId: true } },
        },
      });

      const { userToProjects, ...userData } = userResult;
      const authenticatedEntity = {
        user: userData,
        projectIds: userToProjects?.map(userToProject => userToProject.projectId) || null,
        type: 'user',
      } as AuthenticatedEntity & { projectIds: string[] | null };

      return done(null, authenticatedEntity);
    } catch (err) {
      if (!isRecordNotFoundError(err)) throw err;

      return done(null, null);
    }
  }
}

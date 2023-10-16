import { PassportSerializer } from '@nestjs/passport';
import { Inject } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { isRecordNotFoundError } from '@/prisma/prisma.util';
import { AuthenticatedEntity, UserWithProjects } from '@/types';

export class SessionSerializer extends PassportSerializer {
  constructor(@Inject('USER_SERVICE') private readonly userService: UserService) {
    super();
  }

  serializeUser(user: UserWithProjects, done: (err: unknown, user: AuthenticatedEntity) => void) {
    done(null, {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      type: 'user',
    });
  }

  async deserializeUser(
    user: AuthenticatedEntity,
    done: (err: unknown, user: AuthenticatedEntity | null) => void,
  ) {
    try {
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

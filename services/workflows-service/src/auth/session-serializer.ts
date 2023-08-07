import { PassportSerializer } from '@nestjs/passport';
import { Inject } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { User } from '@prisma/client';
import { isRecordNotFoundError } from '@/prisma/prisma.util';
import {UserWithProjects} from "@/user/types";

export class SessionSerializer extends PassportSerializer {
  constructor(@Inject('USER_SERVICE') private readonly userService: UserService) {
    super();
  }

  serializeUser(
    user: UserWithProjects,
    done: (err: unknown, user: Partial<User & { projectIds: Array<string> }>) => void,
  ) {
    done(null, {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      projectIds: user.userToProjects?.map((userToProject) => userToProject.projectId)
    });
  }

  async deserializeUser(user: User, done: (err: unknown, user: User | null) => void) {
    try {
      const userResult = await this.userService.getById(user.id, {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          userToProjects: { select: { projectId: true } }
        }
      });

      delete (userResult as Partial<User>).password;

      return done(null, userResult);
    } catch (err) {
      if (!isRecordNotFoundError(err)) throw err;

      return done(null, null);
    }
  }
}

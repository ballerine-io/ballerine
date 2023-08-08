import { PassportSerializer } from '@nestjs/passport';
import { Inject } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import {Customer, User } from '@prisma/client';
import { isRecordNotFoundError } from '@/prisma/prisma.util';
import {CustomerWithProjectIds} from "@/types";

export class SessionSerializer extends PassportSerializer {
  constructor(@Inject('USER_SERVICE') private readonly userService: UserService) {
    super();
  }

  serializeUser(
    user: CustomerWithProjectIds,
    done: (err: unknown, user: Partial<CustomerWithProjectIds>) => void,
  ) {
    done(null, {
      id: user.id,
      name: user.name,
      displayName: user.displayName,
      logoImageUri: user.logoImageUri,
      projectIds: user.projectIds
    });
  }

  async deserializeUser(user: CustomerWithProjectIds, done: (err: unknown, user: CustomerWithProjectIds | null) => void) {
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

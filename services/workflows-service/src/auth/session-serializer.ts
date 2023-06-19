import { PassportSerializer } from '@nestjs/passport';
import { Inject } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { User } from '@prisma/client';
import { isRecordNotFoundError } from '@/prisma/prisma.util';

export class SessionSerializer extends PassportSerializer {
  constructor(@Inject('USER_SERVICE') private readonly userService: UserService) {
    super();
  }

  serializeUser(user: User, done: (err: unknown, user: Partial<User>) => void) {
    done(null, {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  }

  async deserializeUser(user: User, done: (err: unknown, user: User | null) => void) {
    try {
      const userResult = await this.userService.getById(user.id);

      delete (userResult as Partial<User>).password;

      return done(null, userResult);
    } catch (err) {
      if (!isRecordNotFoundError(err)) throw err;

      return done(null, null);
    }
  }
}

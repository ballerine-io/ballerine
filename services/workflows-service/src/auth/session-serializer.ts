import { PassportSerializer } from '@nestjs/passport';
import { Inject } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { User } from '@prisma/client';

export class SessionSerializer extends PassportSerializer {
  constructor(@Inject('USER_SERVICE') private readonly userService: UserService) {
    super();
  }

  serializeUser(user: User, done: (err: unknown, user: User) => void) {
    done(null, user);
  }

  async deserializeUser(user: User, done: (err: unknown, user: User | null) => void) {
    const userResult = await this.userService.getById(user.id);

    if (!userResult) {
      return done(null, null);
    }

    return done(null, userResult);
  }
}

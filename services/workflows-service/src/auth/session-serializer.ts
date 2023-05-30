import { PassportSerializer } from '@nestjs/passport';
import { Inject } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { User, Prisma } from '@prisma/client';

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

  async deserializeUser(user: Express.User, done: (err: unknown, user: User | null) => void) {
    let userResult: User;

    try {
      userResult = await this.userService.getById(user.id);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return done(null, null);
      }

      return done(error, null);
    }

    delete (userResult as any).password;

    return done(null, userResult);
  }
}

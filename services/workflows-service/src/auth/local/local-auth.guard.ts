import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SupabaseService } from '../../supabase/supabase.service';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') implements CanActivate {
  constructor(private readonly supabaseService: SupabaseService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const result = super.canActivate(context) as boolean;
    const request = context.switchToHttp().getRequest();
    if (result && request.user) {
      const fullUrl = request.protocol + '://' + request.get('host') + request.originalUrl;
      this.supabaseService.logSignIn(fullUrl);
    }
    super.logIn(request);
    return Promise.resolve(result);
  }
}

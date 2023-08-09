import { Injectable, NestMiddleware, Scope } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { CustomerService } from '@/customer/customer.service';

@Injectable({ scope: Scope.REQUEST })
export class AuthKeyMiddleware implements NestMiddleware {
  constructor(private readonly customerService: CustomerService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const apiKey = authHeader?.split?.(' ')?.[1];

    if (apiKey) {
      const customer = await this.customerService.getByApiKey(apiKey);

      // @ts-expect-error - unused variable projects
      const { projects, ...customerWithoutProjects } = customer;

      if (customer) {
        req.user = {
          // @ts-ignore
          customer: customerWithoutProjects,
          projectIds: customer.projects?.map(project => project.id),
        };
      }
    }

    next();
  }
}

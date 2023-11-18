import { Injectable, NestMiddleware, Scope } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { CustomerService } from '@/customer/customer.service';
import { ClsService } from 'nestjs-cls';

@Injectable({ scope: Scope.REQUEST })
export class AuthKeyMiddleware implements NestMiddleware {
  constructor(
    private readonly customerService: CustomerService,
    private readonly cls: ClsService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const apiKey = authHeader?.split?.(' ')?.[1];

    if (apiKey) {
      const customer = await this.customerService.getByApiKey(apiKey);

      if (!customer) return next();

      const { projects, authenticationConfiguration, ...customerWithoutProjects } = customer;

      this.cls.set('entity', {
        customer: {
          id: customer.id,
          name: customer.name,
        },
        type: 'customer',
      });

      req.user = {
        customer: customerWithoutProjects,
        // @ts-expect-error `User`'s type does not match the `Customer`'s type
        projectIds: customer.projects?.map(project => project.id),
        type: 'customer',
      };
    }

    next();
  }
}

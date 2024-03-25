import { isEmpty } from 'lodash';
import { Injectable, NestMiddleware, Scope } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ClsService } from 'nestjs-cls';
import { ApiKeyService } from '@/customer/api-key/api-key.service';

@Injectable({ scope: Scope.REQUEST })
export class AuthKeyMiddleware implements NestMiddleware {
  constructor(private readonly apiKeyService: ApiKeyService, private readonly cls: ClsService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const apiKey = authHeader?.split?.(' ')?.[1];

    if (apiKey) {
      const dbApiKey = await this.apiKeyService.find(apiKey);

      if (!dbApiKey || isEmpty(dbApiKey)) {
        return next();
      }

      const { id, name, projects, authenticationConfiguration, ...customerWithoutProjects } =
        dbApiKey.customer;

      this.cls.set('entity', {
        customer: {
          id: dbApiKey.customer.id,
          name: dbApiKey.customer.name,
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

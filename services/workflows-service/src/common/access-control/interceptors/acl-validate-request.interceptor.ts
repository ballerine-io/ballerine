// import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { InjectRolesBuilder, Role, RolesBuilder } from 'nest-access-control';
// import { Reflector } from '@nestjs/core';
// import * as abacUtil from '../abac.util';
// import { ForbiddenException } from '../../../errors';
//
// @Injectable()
// export class AclValidateRequestInterceptor implements NestInterceptor {
//   constructor(
//     @InjectRolesBuilder() private readonly rolesBuilder: RolesBuilder,
//     private readonly reflector: Reflector,
//   ) {}
//
//   intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
//     const permissionsRoles = this.reflector.getAllAndMerge<string[]>('roles', [
//       context.getHandler(),
//       context.getClass(),
//     ])[0] as Role;
//
//     const type = context.getType();
//
//     const inputDataToValidate =
//       type === 'http'
//         ? context.switchToHttp().getRequest<{ body: Record<string, unknown> }>().body
//         : context.getArgByIndex<{ data: Record<string, unknown> }>(1).data;
//
//     const permission = this.rolesBuilder.permission({
//       action: permissionsRoles.action,
//       possession: permissionsRoles.possession,
//       resource: permissionsRoles.resource,
//     });
//
//     const invalidAttributes = abacUtil.getInvalidAttributes(permission, inputDataToValidate);
//
//     if (invalidAttributes.length) {
//       throw new ForbiddenException('Insufficient privileges to complete the operation');
//     }
//
//     return next.handle();
//   }
// }

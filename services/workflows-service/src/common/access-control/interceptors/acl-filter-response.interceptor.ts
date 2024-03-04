// import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
// import { InjectRolesBuilder, Permission, Role, RolesBuilder } from 'nest-access-control';
// import { Reflector } from '@nestjs/core';
// import {Permission} from "accesscontrol";
//
// @Injectable()
// export class AclFilterResponseInterceptor implements NestInterceptor {
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
//     const permission: Permission = this.rolesBuilder.permission({
//       action: permissionsRoles.action,
//       possession: permissionsRoles.possession,
//       resource: permissionsRoles.resource,
//     });
//
//     return next.handle().pipe(
//       map(data => {
//         if (Array.isArray(data)) {
//           return data.map((results: unknown) => permission.filter(results) as unknown);
//         } else {
//           return permission.filter(data) as unknown;
//         }
//       }),
//     );
//   }
// }

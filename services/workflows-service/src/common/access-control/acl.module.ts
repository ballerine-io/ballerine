import { Module } from '@nestjs/common';
// import { AccessControlModule, RolesBuilder } from 'nest-access-control';
// import grants from '../../grants.json';

// const rolesBuilder = new RolesBuilder(grants);

@Module({
  // imports: [AccessControlModule.forRoles(rolesBuilder)],
  providers: [
    // {
    // provide: RolesBuilder,
    // useValue: rolesBuilder,
    // },
  ],
  // exports: [RolesBuilder], // Export RolesBuilder
})
export class ACLModule {}

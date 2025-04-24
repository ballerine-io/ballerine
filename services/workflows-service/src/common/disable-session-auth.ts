import { SetMetadata } from '@nestjs/common';

export const DISABLE_SESSION_AUTH = 'DISABLE_SESSION_AUTH';

export const disableSessionAuth = () => SetMetadata(DISABLE_SESSION_AUTH, true);

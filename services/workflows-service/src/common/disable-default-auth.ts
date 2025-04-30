import { SetMetadata } from '@nestjs/common';

export const DISABLE_DEFAULT_AUTH = 'DISABLE_DEFAULT_AUTH';

export const disableDefaultAuth = () => SetMetadata(DISABLE_DEFAULT_AUTH, true);

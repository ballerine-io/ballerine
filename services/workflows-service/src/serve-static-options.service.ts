import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServeStaticModuleOptions, ServeStaticModuleOptionsFactory } from '@nestjs/serve-static';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';

const SERVE_STATIC_ROOT_PATH_VAR = 'SERVE_STATIC_ROOT_PATH';
const DEFAULT_STATIC_MODULE_OPTIONS_LIST: ServeStaticModuleOptions[] = [
  {
    serveRoot: '/swagger',
    rootPath: path.join(__dirname, 'swagger'),
  },
];

@Injectable()
export class ServeStaticOptionsService implements ServeStaticModuleOptionsFactory {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: AppLoggerService,
  ) {}

  createLoggerOptions(): ServeStaticModuleOptions[] {
    const serveStaticRootPath = this.configService.get(SERVE_STATIC_ROOT_PATH_VAR) as string;

    if (serveStaticRootPath) {
      const resolvedPath = path.resolve(serveStaticRootPath);
      this.logger.log('Serving static files', { resolvedPath });

      return [
        ...DEFAULT_STATIC_MODULE_OPTIONS_LIST,
        {
          rootPath: resolvedPath,
          exclude: ['/api*'],
        },
      ];
    }

    return DEFAULT_STATIC_MODULE_OPTIONS_LIST;
  }
}

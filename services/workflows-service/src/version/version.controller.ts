import { Controller, Get } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

@Controller('version')
export class VersionController {
  @Get()
  getVersion(): {name: string, version: string} {
    const filePath = join(__dirname, '..', '..', 'package.json');
    const packageFile = readFileSync(filePath, 'utf8');
    const name = JSON.parse(packageFile).name as string;
    const version = JSON.parse(packageFile).version  as string;
    return {
      name,
      version
    };
  }
}

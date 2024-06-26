import { Public } from '@/common/decorators/public.decorator';
import * as common from '@nestjs/common';
import { Controller, Res } from '@nestjs/common';
import * as YAML from 'yaml';
import express from 'express';
import { ApiExcludeController } from '@nestjs/swagger';
import swagger from '@/swagger/swagger';

@Controller('/external/swagger')
@ApiExcludeController()
export class SwaggerController {
  @common.HttpCode(200)
  @common.Get('/yaml')
  @Public()
  async getSwaggerYaml(@Res() res: express.Response): Promise<any> {
    const content = YAML.stringify(swagger.document);

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename=swagger.yaml');
    res.send(content);

    return;
  }

  @common.HttpCode(200)
  @common.Get('/json')
  @Public()
  async getSwaggerJson(): Promise<any> {
    return swagger.document;
  }
}

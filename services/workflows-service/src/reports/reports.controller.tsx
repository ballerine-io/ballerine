import React from 'react';
import { Public } from '@/common/decorators/public.decorator';
import { Controller, Get, Response } from '@nestjs/common';
import { ReportTemplate, registerFont } from '@ballerine/react-pdf-toolkit';
import { Font, renderToFile } from '@react-pdf/renderer';
import { Response as TResponse } from 'express';
import fs from 'fs';

@Controller('/reports')
export class ReportsController {
  @Public()
  @Get()
  //@ts-ignore
  async getReport(@Response() res: TResponse<any>) {
    registerFont(Font);

    const pdfName = `${+new Date()}.pdf`;

    await renderToFile(<ReportTemplate dynamicValue={new Date().toString()} />, pdfName);

    res.download(pdfName, () => {
      fs.unlinkSync(pdfName);
    });
  }
}

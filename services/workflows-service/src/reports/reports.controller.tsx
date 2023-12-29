import { Public } from '@/common/decorators/public.decorator';
import { ReportTemplate, registerFont, reportData } from '@ballerine/react-pdf-toolkit';
import { Controller, Get, Response } from '@nestjs/common';
import { Font, renderToFile } from '@react-pdf/renderer';
import { Response as TResponse } from 'express';
import fs from 'fs';
import React from 'react';

@Controller('/reports')
export class ReportsController {
  @Public()
  @Get()
  //@ts-ignore
  async getReport(@Response() res: TResponse<any>) {
    registerFont(Font);

    const pdfName = `${+new Date()}.pdf`;

    await renderToFile(<ReportTemplate report={reportData} />, pdfName);

    res.download(pdfName, () => {
      fs.unlinkSync(pdfName);
    });
  }
}

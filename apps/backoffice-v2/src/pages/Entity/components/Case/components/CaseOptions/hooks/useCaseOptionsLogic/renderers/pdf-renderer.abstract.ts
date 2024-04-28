import { TWorkflowById } from '@/domains/workflows/fetchers';
import { z } from 'zod';

export abstract class IPDFRenderer<TPDFData> {
  static PDF_NAME: string;

  constructor(readonly workflow: TWorkflowById, readonly validationSchema: z.ZodAny) {}

  abstract render(): JSX.Element;

  abstract getData(): TPDFData;

  abstract isValid(): boolean;
}

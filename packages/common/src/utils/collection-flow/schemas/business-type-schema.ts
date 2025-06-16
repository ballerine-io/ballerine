import { z } from 'zod';
import { BUSINESS_TYPE } from '../consts/business-type';

export const BusinessTypeSchema = z.enum(BUSINESS_TYPE);

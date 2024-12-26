import { ApiProperty } from '@nestjs/swagger';
import {
  MERCHANT_REPORT_STATUSES,
  MERCHANT_REPORT_TYPES,
  MERCHANT_REPORT_VERSIONS,
  type MerchantReportStatus,
  type MerchantReportType,
  type MerchantReportVersion,
} from '@/business-report/constants';

export class WebsiteDto {
  @ApiProperty({ type: String })
  id!: string;

  @ApiProperty({ type: String })
  url!: string;

  @ApiProperty({ type: String })
  createdAt!: string;

  @ApiProperty({ type: String })
  updatedAt!: string;
}

export class BusinessReportDto {
  @ApiProperty({ type: String })
  id!: string;

  @ApiProperty({ type: String })
  websiteId!: string;

  @ApiProperty({ type: String })
  merchantId!: string;

  @ApiProperty({ type: String, enum: MERCHANT_REPORT_TYPES })
  reportType!: MerchantReportType;

  @ApiProperty({ type: String, enum: MERCHANT_REPORT_VERSIONS })
  workflowVersion!: MerchantReportVersion;

  @ApiProperty({ type: String })
  parentCompanyName!: string;

  @ApiProperty({ type: String, enum: MERCHANT_REPORT_STATUSES })
  status!: MerchantReportStatus;

  @ApiProperty({ type: Number })
  riskScore!: number;

  @ApiProperty({ type: String, nullable: true, required: false })
  companyName?: string;

  @ApiProperty({ type: Boolean })
  isAlert!: boolean;

  @ApiProperty({ type: WebsiteDto })
  website!: WebsiteDto;

  @ApiProperty({ type: String })
  createdAt!: string;

  @ApiProperty({ type: String })
  updatedAt!: string;

  @ApiProperty({ type: Object })
  data!: Record<string, unknown>;
}

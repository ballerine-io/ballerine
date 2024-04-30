import { TObjectValues } from '@/common/types';
import { KYC, Role, Sanction } from '@/pages/Profiles/Individuals/components/ProfilesTable/columns';

export interface IProfilesTableProps {
  data: Array<{
    id: string;
    createdAt: string;
    name: string;
    business: string;
    role: TObjectValues<typeof Role>;
    kyc: TObjectValues<typeof KYC>;
    sanctions: TObjectValues<typeof Sanction>;
    alerts: number;
    updatedAt: string;
  }>;
}

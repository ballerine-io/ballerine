import { AlertAnalysisItem } from '@/pages/TransactionMonitoringAlerts/components/AlertAnalysisSheet/components/AlertAnalysisTable/columns';

export const data: AlertAnalysisItem[] = Array.from({ length: 30 }, (_, index) => ({
  date: new Date(),
  transactionId: `txn-${index + 1}`,
  direction: index % 2 === 0 ? 'In' : 'Out',
  amount: `${Math.floor(Math.random() * 1000)}.00`,
  business: `Business ${index + 1}`,
  businessId: `biz-${index + 1}`,
  counterPartyName: `CounterParty ${index + 1}`,
  counterPartyId: `cp-${index + 1}`,
  counterPartyInstitution: `Institution ${index + 1}`,
}));

export const MatchResponseCode = {
  M00: 'M00',
  M01: 'M01',
  M02: 'M02',
} as const;

export const MatchReasonCode = {
  '00': 'Questionable Merchant/Under Investigation',
  '01': 'Account Data Compromise',
  '02': 'Common Point of Purchase (CPP)',
  '03': 'Laundering',
  '04': 'Excessive Chargebacks',
  '05': 'Excessive Fraud',
  '06': 'Reserved for Future Use',
  '08': 'Mastercard Questionable Merchant Audit Program',
  '09': 'Bankruptcy/Liquidation/Insolvency',
  '10': 'Violation of Standards',
  '11': 'Merchant Collusion',
  '12': 'PCI Data Security Standard Noncompliance',
  '13': 'Illegal Transactions',
  '14': 'Identity Theft',
  '20': 'Mastercard Questionable Merchant Audit Program',
  '21': 'Listing under Privacy Review',
  '24': 'Illegal Transactions',
} as const;

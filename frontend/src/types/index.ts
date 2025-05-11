export interface Property {
  id: string | number;
  srNo: number | string;
  projectName: string;
  projectType: string;
  unitNo: string;
  customerName: string;
  superBuiltUpArea: number;
  rate: number;
  totalConsideration: number;
  netReceived: number;
  assuredValue: number;
  totalConsiderationInCr?: number;
  sellAtPremiumPrice?: number;
  netProfitInCr?: number;
  netReceivedInCr?: number;
  bookingAmount: number;
  newOffer?: number;
  soldOffer?: number;
}

export type PaymentPlan =
  | 'standard'
  | 'flexi'
  | 'subvention'
  | 'res1'
  | 'res2'
  | 'comm'
  | { label: string; percent: number }[];
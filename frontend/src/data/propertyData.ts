export interface Property {
  id: number;
  srNo: string;
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
}

export const propertyData: Property[] = [
  {
    id: 1,
    srNo: 'UBP-1',
    projectName: '65TH AVENUE',
    projectType: 'Commercial',
    unitNo: 'Kiosk-1',
    customerName: 'Mr. JASWINDER SINGH LAMBA',
    superBuiltUpArea: 1243.09,
    rate: 20586.9824389224,
    totalConsideration: 25591472,
    netReceived: 25591472,
    assuredValue: 14000,
    totalConsiderationInCr: 2.5591472,
    sellAtPremiumPrice: 14000,
    netProfitInCr: -0.8188212,
    netReceivedInCr: 2.5591472
  },
  {
    id: 2,
    srNo: 'UBP-9',
    projectName: '65TH AVENUE',
    projectType: 'Commercial',
    unitNo: 'Kiosk-17',
    customerName: 'Mr. VIPUL BAJAJ',
    superBuiltUpArea: 1273.66,
    rate: 12861.3876544761,
    totalConsideration: 16381035,
    netReceived: 16381035,
    assuredValue: 14000,
    totalConsiderationInCr: 1.6381035,
    sellAtPremiumPrice: 14000,
    netProfitInCr: 0.1450205,
    netReceivedInCr: 1.6381035
  },
  {
    id: 3,
    srNo: 'UBP-26',
    projectName: '65TH AVENUE',
    projectType: 'Commercial',
    unitNo: 'R1  1 02',
    customerName: 'Ms. NIKITA AGGARWAL',
    superBuiltUpArea: 801.04,
    rate: 16691.2825826426,
    totalConsideration: 13370385,
    netReceived: 13370385,
    assuredValue: 16000,
    totalConsiderationInCr: 1.3370385,
    sellAtPremiumPrice: 16000,
    netProfitInCr: -0.0553745,
    netReceivedInCr: 1.3370385
  },
  {
    id: 4,
    srNo: 'UBP-27',
    projectName: '65TH AVENUE',
    projectType: 'Commercial',
    unitNo: 'R1  1 03',
    customerName: 'Mr. JASWINDER SINGH LAMBA',
    superBuiltUpArea: 801.04,
    rate: 19414.0030460402,
    totalConsideration: 15551393,
    netReceived: 15551393,
    assuredValue: 16000,
    totalConsiderationInCr: 1.5551393,
    sellAtPremiumPrice: 16000,
    netProfitInCr: -0.2734753,
    netReceivedInCr: 1.5551393
  },
  {
    id: 5,
    srNo: 'UBP-35',
    projectName: '65TH AVENUE',
    projectType: 'Commercial',
    unitNo: 'R1  1 11',
    customerName: 'SANJAY RATRA (HUF)',
    superBuiltUpArea: 801.04,
    rate: 12501.706531509,
    totalConsideration: 10014367,
    netReceived: 10014367,
    assuredValue: 16000,
    totalConsiderationInCr: 1.0014367,
    sellAtPremiumPrice: 16000,
    netProfitInCr: 0.2802273,
    netReceivedInCr: 1.0014367
  },
  {
    id: 6,
    srNo: 'UBP-36',
    projectName: '65TH AVENUE',
    projectType: 'Commercial',
    unitNo: 'R1  1 12',
    customerName: 'SANJAY RATRA (HUF)',
    superBuiltUpArea: 801.04,
    rate: 12501.706531509,
    totalConsideration: 10014367,
    netReceived: 10014367,
    assuredValue: 16000,
    totalConsiderationInCr: 1.0014367,
    sellAtPremiumPrice: 16000,
    netProfitInCr: 0.2802273,
    netReceivedInCr: 1.0014367
  },
  {
    id: 7,
    srNo: 'UBP-168',
    projectName: '65TH AVENUE',
    projectType: 'Commercial',
    unitNo: 'R1 G 39',
    customerName: 'Mr. ANKUR MEHTA',
    superBuiltUpArea: 2007.36,
    rate: 21827.4270683883,
    totalConsideration: 43815504,
    netReceived: 43815504,
    assuredValue: 40000,
    totalConsiderationInCr: 4.3815504,
    sellAtPremiumPrice: 40000,
    netProfitInCr: 3.6478896,
    netReceivedInCr: 4.3815504
  },
  {
    id: 8,
    srNo: 'UBP-205',
    projectName: '65TH AVENUE',
    projectType: 'Commercial',
    unitNo: 'R1 LG 11',
    customerName: 'Mr. SHASHI BHUSHAN MUNJAL',
    superBuiltUpArea: 1064.46,
    rate: 15357.282565808,
    totalConsideration: 16347213,
    netReceived: 16347213,
    assuredValue: 30000,
    totalConsiderationInCr: 1.6347213,
    sellAtPremiumPrice: 30000,
    netProfitInCr: 1.5586587,
    netReceivedInCr: 1.6347213
  },
  {
    id: 9,
    srNo: 'UBP-1154',
    projectName: 'IFC',
    projectType: 'Commercial',
    unitNo: 'R3 0 21',
    customerName: 'Mr. ANKUR MEHTA',
    superBuiltUpArea: 3332.93,
    rate: 19177.0799266711,
    totalConsideration: 63915865,
    netReceived: 63915865,
    assuredValue: 55000,
    totalConsiderationInCr: 6.3915865,
    sellAtPremiumPrice: 55000,
    netProfitInCr: 11.9395285,
    netReceivedInCr: 6.3915865
  },
  {
    id: 10,
    srNo: 'UBP-16404',
    projectName: 'M3M WOODSHIRE',
    projectType: 'Residential',
    unitNo: 'MW/CLUB/UNIT',
    customerName: 'AARON BUILDMART PVT. LTD.',
    superBuiltUpArea: 15835,
    rate: 3000,
    totalConsideration: 47505000,
    netReceived: 4727995,
    assuredValue: 9000,
    totalConsiderationInCr: 4.7505,
    sellAtPremiumPrice: 9000,
    netProfitInCr: 9.501,
    netReceivedInCr: 4.727995
  },
];
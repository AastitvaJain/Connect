interface BaseInventory {
  id: string;
  projectName: string;
  projectType: string;
  unitNo: string;
  builtUpArea: number;
  rate: number;
  totalConsideration: number;
}

export interface SoldInventoryDto extends BaseInventory {
  buyerName: string;
  netReceived: number;
  assuredPrice: number;
  soldOffer?: number;
}

export interface NewInventoryDto extends BaseInventory {
  bookingAmount: number;
  newOffer?: number;
}

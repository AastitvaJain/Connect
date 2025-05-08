export interface InventoryRequest {
    page?: number;
    pageSize?: number;
    projectNameFilter?: string;
    unitNoFilter?: string;
    buyerNameFilter?: string; // Used only for sold inventory
  }
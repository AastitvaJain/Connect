export interface PropertyRateChange {
    propertyId: string; // UUID
    originalRate: number;
    proposedRate: number;
  }
  
  export interface CostSheetItem {
    particular: string;
    paymentPercentage: number;
    totalPaymentWithoutTax: number;
    ftAdjustment: number;
    discountAdjustment: number;
    netPayableByCustomer: number;
    gstPayable: number;
    sequence: number;
  }
  
  export interface CostSheet {
    propertyId: string; // UUID
    items: CostSheetItem[];
  }
  
  export interface CreateApprovalRequest {
    sellPropertyChanges: PropertyRateChange[];
    buyPropertyChanges: PropertyRateChange[];
    costSheet: CostSheet[];
  }

  export interface RejectRequest {
    requestId: number;
    reason: string;
  }

  export interface ApproveRequest extends CreateApprovalRequest {
    requestId: number;
    reason?: string;
  }
  
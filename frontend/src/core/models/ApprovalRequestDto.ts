import { NewInventoryDto, SoldInventoryDto } from "./InventoryDto";
import { CostSheet, PropertyRateChange } from "./requests/ApprovalRequest";

export interface ApprovalRequestDto {
    id: number;
    name: string;
    email: string;
    phone: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    sellPropertyChanges: PropertyRateChange[];
    buyPropertyChanges: PropertyRateChange[];
    soldInventories: SoldInventoryDto[];
    newInventories: NewInventoryDto[];
    costSheet: CostSheet[];
    isApplied: boolean;
  }
  
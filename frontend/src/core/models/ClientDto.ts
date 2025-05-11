import { SoldInventoryDto, NewInventoryDto } from "./InventoryDto";
export interface PropertyRecord {
    id: string;
    originalrate: number;
    draftRate?: number; 
    approvedRate?: number; 
    paymentPlan?: string;
  }
  
  export interface ClientPayment {
    amountPaid: number;
    paymentMode?: string;
    paymentId: number;
    channelPartnerId?: string;
    customChannelPartnerName?: string;
    customChannelPartnerNumber?: string;
  }

  export interface ClientDto {
    id: string;
    name: string;
    email?: string;
    phoneNumber?: string;
    sellRecords?: PropertyRecord[];
    buyRecords?: PropertyRecord[];
    soldInventories?: SoldInventoryDto[];
    newInventories?: NewInventoryDto[];
    payment?: ClientPayment;
  }
  
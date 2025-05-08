export interface PropertyRecord {
    id: string;
    rate: number;
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
    payment?: ClientPayment;
  }
  
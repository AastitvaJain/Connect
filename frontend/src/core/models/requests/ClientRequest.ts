import type { PropertyRecord, ClientPayment } from '../ClientDto';

export interface CreateClientTokenRequest {
  name?: string;
  email?: string;
  phoneNumber?: string;
  sellRecords?: PropertyRecord[];
}

export interface UpdateClientTokenRequest extends CreateClientTokenRequest {
  buyRecords?: PropertyRecord[];
  payment?: ClientPayment;
  isSubmitted?: boolean;
}

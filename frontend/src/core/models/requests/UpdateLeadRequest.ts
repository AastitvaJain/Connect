import type { PropertyRecord } from "../ClientDto";

export interface UpdateLeadRequest {
    name: string;
    sellRecords: PropertyRecord[];
    interestedProject?: string;
    leadStatus?: string;
}
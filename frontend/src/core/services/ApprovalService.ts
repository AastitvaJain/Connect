import { approveRequest, createRequest, getRequestsByStatus, getRequestsByToken, rejectRequest } from "../api/approvalApi";
import { ApprovalRequestStatus } from "../models/Enums";
import { PropertyRateChange } from "../models/requests/ApprovalRequest";
import { CostSheet } from "../models/requests/ApprovalRequest";

export const getApprovalRequests = async (status: ApprovalRequestStatus, page = 1, pageSize = 10) => {
    const response = await getRequestsByStatus(status, page, pageSize);
    return response;
};

export const getApprovalRequestsByToken = async (token: number) => {
    const response = await getRequestsByToken(token);
    return response;
};

export const makeApproveRequest = async (requestId: number, reason: string, sellPropertyChanges: PropertyRateChange[], buyPropertyChanges: PropertyRateChange[], costSheet: CostSheet[]) => {
    const response = await approveRequest({requestId, reason, sellPropertyChanges, buyPropertyChanges, costSheet});
    return response;
};

export const makeRejectRequest = async (requestId: number, reason: string) => {
    const response = await rejectRequest({requestId, reason});
    return response;
};

export const createApprovalRequest = async (token: number, sellPropertyChanges: PropertyRateChange[], buyPropertyChanges: PropertyRateChange[], costSheet: CostSheet[]) => {
    const response = await createRequest(token, {sellPropertyChanges, buyPropertyChanges, costSheet});
    return response;
};
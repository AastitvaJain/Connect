import { request } from './request';
import { ApproveRequest, CreateApprovalRequest, RejectRequest } from '../models/requests/ApprovalRequest';
import { PagedResult } from '../models/PagedResult';
import { ApprovalRequestDto } from '../models/ApprovalRequestDto';

export const createRequest = (token: number, data: CreateApprovalRequest) =>
    request<number>({
      method: 'POST',
      url: `/create-request/${token}`,
      data,
      withAuth: true
    });


export const rejectRequest = (data: RejectRequest) =>
    request<void>({
        method: 'POST',
        url: '/reject-request',
        data,
        withAuth: true
    });

export const approveRequest = (data: ApproveRequest) =>
    request<void>({
        method: 'POST',
        url: '/approve-request',
        data,
        withAuth: true
    });

export const getRequestsByStatus = (status?: string, page = 1, pageSize = 10) =>
    request<PagedResult<ApprovalRequestDto>>({
        method: 'GET',
        url: '/request',
        params: { status, page, pageSize },
        withAuth: true
    });
    
    /**
     * GET /request/{token}
     */
export const getRequestsByToken = (token: number) =>
    request<ApprovalRequestDto[]>({
        method: 'GET',
        url: `/request/${token}`,
        withAuth: true
    });
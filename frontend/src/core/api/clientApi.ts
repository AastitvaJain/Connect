import { request } from './request';
import type {
  CreateClientTokenRequest,
  UpdateClientTokenRequest
} from '../models/requests/ClientRequest';
import type { ClientDto } from '../models/ClientDto';

export const createClientToken = (data: CreateClientTokenRequest) =>
  request<{ token: number }>({
    method: 'POST',
    url: '/client-token',
    data,
    auth: true
  } as any);

export const getClientToken = (token: number) =>
  request<ClientDto>({
    method: 'GET',
    url: `/client-token/${token}`,
    auth: true
  } as any);

export const updateClientToken = (token: number, data: UpdateClientTokenRequest) =>
  request<ClientDto>({
    method: 'PUT',
    url: `/client-token/${token}`,
    data,
    auth: true
  } as any);

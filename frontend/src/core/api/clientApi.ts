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
    withAuth: true
  });

export const getClientToken = (token: number) =>
  request<{ clientData: ClientDto } | ClientDto>({
    method: 'GET',
    url: `/client-token/${token}`,
    withAuth: true
  }).then(resp => ('clientData' in resp ? resp.clientData : resp));

export const updateClientToken = (token: number, data: UpdateClientTokenRequest) =>
  request<ClientDto>({
    method: 'PUT',
    url: `/client-token/${token}`,
    data,
    withAuth: true
  });

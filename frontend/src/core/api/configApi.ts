import { request } from './request';
import type { ChannelPartnerDto, ProjectNameDto } from '../models/ConfigDto';

// POST /configs/cp
export const getChannelPartnersApi = (data = { page: 1, pageSize: 100 }) =>
  request<ChannelPartnerDto[]>({
    method: 'POST',
    url: '/configs/cp',
    data,
    auth: true
  } as any);

// POST /configs/new-project-names
export const getNewProjectNamesApi = (data = { page: 1, pageSize: 100 }) =>
  request<ProjectNameDto[]>({
    method: 'POST',
    url: '/configs/new-project-names',
    data,
    auth: true
  } as any);

// POST /configs/sold-project-names
export const getSoldProjectNamesApi = (data = { page: 1, pageSize: 100 }) =>
  request<ProjectNameDto[]>({
    method: 'POST',
    url: '/configs/sold-project-names',
    data,
    auth: true
  } as any);

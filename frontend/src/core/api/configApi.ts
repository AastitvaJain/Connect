import { request } from './request';
import type { ChannelPartnerDto, ProjectNameDto } from '../models/ConfigDto';

// GET /configs/cp
export const getChannelPartnersApi = () =>
  request<ChannelPartnerDto[]>({
    method: 'GET',
    url: '/configs/cp',
    withAuth: true
  });

// GET /configs/new-project-names
export const getNewProjectNamesApi = () =>
  request<ProjectNameDto[]>({
    method: 'GET',
    url: '/configs/new-project-names',
    withAuth: true
  });

// GET /configs/sold-project-names
export const getSoldProjectNamesApi = () =>
  request<ProjectNameDto[]>({
    method: 'GET',
    url: '/configs/sold-project-names',
    withAuth: true
  });

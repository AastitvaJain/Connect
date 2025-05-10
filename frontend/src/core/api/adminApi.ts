import { request } from './request';
import type { ProjectOffer } from '../models/ProjectOffers';

/**
 * GET /admin/offers
 * Fetches a list of project offers.
 */
export const getProjectOffers = () =>
  request<ProjectOffer[]>({
    method: 'GET',
    url: '/admin/offers',
    withAuth: true
  });

/**
 * PUT /admin/offers
 * Updates a list of project offers.
 */
export const updateOffers = (projectOffers: ProjectOffer[]) =>
  request<ProjectOffer[]>({
    method: 'PUT',
    url: '/admin/offers',
    data: projectOffers,
    withAuth: true
  });

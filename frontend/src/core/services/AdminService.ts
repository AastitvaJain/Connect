import { getProjectOffers, updateOffers } from '../api/adminApi';
import type { ProjectOffer } from '../models/ProjectOffers';

export const fetchProjectOffers = async (): Promise<ProjectOffer[]> => {
  const response = await getProjectOffers();
  return response;
};

export const saveProjectOffers = async (offers: ProjectOffer[]): Promise<ProjectOffer[]> => {
  const response = await updateOffers(offers);
  return response;
};

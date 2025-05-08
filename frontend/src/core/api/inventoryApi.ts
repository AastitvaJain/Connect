import { request } from './request';
import type { InventoryRequest } from '../models/requests/InventoryRequest';
import type { SoldInventoryDto, NewInventoryDto } from '../models/InventoryDto';

// POST /get/new-inventory
export const getNewInventory = (data: InventoryRequest) =>
  request<NewInventoryDto[]>({
    method: 'POST',
    url: '/get/new-inventory',
    data,
    withAuth: true
  });

// POST /get/sold-inventory
export const getSoldInventory = (data: InventoryRequest) =>
  request<SoldInventoryDto[]>({
    method: 'POST',
    url: '/get/sold-inventory',
    data,
    withAuth: true
  });

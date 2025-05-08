import {
    getNewInventory,
    getSoldInventory
  } from '../api/inventoryApi';
  import type { NewInventoryDto, SoldInventoryDto } from '../models/InventoryDto';
  
  const DEFAULT_PAGE = 1;
  const DEFAULT_PAGE_SIZE = 10;
  
  export const fetchNewInventory = async (
    page?: number,
    pageSize?: number,
    projectNameFilter?: string,
    unitNoFilter?: string
  ): Promise<NewInventoryDto[]> => {
    return await getNewInventory({
      page: !page ? DEFAULT_PAGE : page,
      pageSize: !pageSize ? DEFAULT_PAGE_SIZE : pageSize,
      projectNameFilter,
      unitNoFilter
    });
};
  
  export const fetchSoldInventory = async (
    page?: number,
    pageSize?: number,
    projectNameFilter?: string,
    unitNoFilter?: string,
    buyerNameFilter?: string
  ): Promise<SoldInventoryDto[]> => {
    return await getSoldInventory({
      page: !page ? DEFAULT_PAGE : page,
      pageSize: !pageSize ? DEFAULT_PAGE_SIZE : pageSize,
      projectNameFilter,
      unitNoFilter,
      buyerNameFilter
    });
};
  
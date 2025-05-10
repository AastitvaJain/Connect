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
  ): Promise<{
    items: NewInventoryDto[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  }> => {
    const response = await getNewInventory({
      page: !page ? DEFAULT_PAGE : page,
      pageSize: !pageSize ? DEFAULT_PAGE_SIZE : pageSize,
      projectNameFilter,
      unitNoFilter
    });
    const inv = response;
    return {
      items: inv.items,
      totalCount: inv.totalCount,
      pageNumber: inv.pageNumber,
      pageSize: inv.pageSize,
      totalPages: inv.totalPages,
    };
  };
  
  export const fetchSoldInventory = async (
    page?: number,
    pageSize?: number,
    projectNameFilter?: string,
    unitNoFilter?: string,
    buyerNameFilter?: string
  ): Promise<{
    items: SoldInventoryDto[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  }> => {
    const response = await getSoldInventory({
      page: !page ? DEFAULT_PAGE : page,
      pageSize: !pageSize ? DEFAULT_PAGE_SIZE : pageSize,
      projectNameFilter,
      unitNoFilter,
      buyerNameFilter
    });
    const inv = response;
    return {
      items: inv.items,
      totalCount: inv.totalCount,
      pageNumber: inv.pageNumber,
      pageSize: inv.pageSize,
      totalPages: inv.totalPages,
    };
  };
  
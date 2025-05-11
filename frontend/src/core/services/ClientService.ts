import { createClientToken, getClientToken, updateClientToken } from '../api/clientApi';
import type { SoldInventoryDto } from '../models/InventoryDto';
import type { CreateClientTokenRequest, UpdateClientTokenRequest } from '../models/requests/ClientRequest';
import type { PropertyRecord, ClientPayment } from '../models/ClientDto';

export { updateClientToken };

export const generateTokenForExistingCustomer = async (
  soldUnits: SoldInventoryDto[]
) => {
  if (!soldUnits.length) {
    throw new Error('No sold inventory records provided.');
  }

  // Extract unique buyer names
  const uniqueNames = Array.from(
    new Set(soldUnits.map(unit => unit.buyerName?.trim()).filter(Boolean))
  );

  const name = uniqueNames.join(', ');

  const sellRecords = soldUnits.map(unit => ({
    id: unit.id,
    rate: unit.rate
  }));

  const payload: CreateClientTokenRequest = {
    name,
    sellRecords
  };

  const response = await createClientToken(payload);
  return response;
};

export const generateTokenForNewCustomer = async (
  name: string,
  email: string,
  phoneNumber: string
) => {

  const payload: CreateClientTokenRequest = {
    name,
    email,
    phoneNumber
  };

  const response = await createClientToken(payload);
  return response;
};

export const getClientFromToken = async (tokenId: number) => {
  const response = await getClientToken(tokenId);
  return response;
};

export const updateClientProfile = async (
  tokenId: number,
  name: string,
  email: string,
  phoneNumber: string
) => {

  const payload: UpdateClientTokenRequest = {
    name,
    email,
    phoneNumber
  };

  const response = await updateClientToken(tokenId, payload);
  return response;
};

export const updatePropertyRecords = async (
    tokenId: number,
    sellUnits: PropertyRecord[],
    buyUnits: PropertyRecord[]
  ) => {

    const response = await updateClientToken(tokenId, {
      sellRecords: sellUnits,
      buyRecords: buyUnits
    });
    return response;
};

export const updatePayment = async (
  tokenId: number,
  payment: ClientPayment
) => {
  const response = await updateClientToken(tokenId, {
    payment : payment
  });
  return response;
};
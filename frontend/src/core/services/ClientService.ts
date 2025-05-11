import { createClientToken, getClientToken, updateClientToken, updateLeadStatusApi } from '../api/clientApi';
import type { SoldInventoryDto } from '../models/InventoryDto';
import type { CreateClientTokenRequest, UpdateClientTokenRequest } from '../models/requests/ClientRequest';
import type { PropertyRecord, ClientPayment } from '../models/ClientDto';
import { UpdateLeadRequest } from '../models/requests/UpdateLeadRequest';

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
    originalrate: unit.rate
  }));

  const payload: CreateClientTokenRequest = {
    name,
    sellRecords: sellRecords
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

export const createLead = async (
  soldUnits: SoldInventoryDto[],
  leadStatus?: string, 
  interestedProject?: string) => {

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
      originalrate: unit.rate
    }));

    const payload: UpdateLeadRequest = {
      name,
      sellRecords,
      leadStatus,
      interestedProject
    };

    const response = await updateLeadStatusApi(payload);
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

  const client = await getClientFromToken(tokenId);

  if (!client) {
    throw new Error('Client not found');
  }

  const payload: UpdateClientTokenRequest = {
    name,
    email,
    phoneNumber,
    sellRecords: client.sellRecords,
    buyRecords: client.buyRecords,
    payment: client.payment
  };

  const response = await updateClientToken(tokenId, payload);
  return response;
};

export const updatePropertyRecords = async (
    tokenId: number,
    sellUnits: PropertyRecord[],
    buyUnits: PropertyRecord[]
  ) => {

    const client = await getClientFromToken(tokenId);

    if (!client) {
      throw new Error('Client not found');
    }

    const response = await updateClientToken(tokenId, {
      name: client.name,
      email: client.email,
      phoneNumber: client.phoneNumber,
      sellRecords: sellUnits,
      buyRecords: buyUnits,
      payment: client.payment
    });
    return response;
};

export const updatePayment = async (
  tokenId: number,
  payment: ClientPayment,
  sellRecords: PropertyRecord[],
  buyRecords: PropertyRecord[]
) => {
  const client = await getClientFromToken(tokenId);

  if (!client) {
    throw new Error('Client not found');
  }

  const response = await updateClientToken(tokenId, {
    name: client.name,
    email: client.email,
    phoneNumber: client.phoneNumber,
    payment : payment,
    sellRecords: sellRecords,
    buyRecords: buyRecords,
    isSubmitted: true
  });

  return response;
};
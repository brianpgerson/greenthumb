import { Watering, STATUS } from '../database';
import { Transaction } from 'sequelize/types';

export interface WateringRequest {
  startDate?: Date,
  endDate?: Date,
  plantId: number,
}

const getFields = (wateringRequest: WateringRequest) => {
  const { startDate: startDateRequest, endDate: endDateRequest, plantId } = wateringRequest;
  const startDate = startDateRequest || new Date(Date.now());
  const endDate  = endDateRequest || null;
  const status = STATUS.PENDING;
  return { startDate, endDate, status, plantId };
}

export const createWatering = async (wateringRequest: WateringRequest, txn?: Transaction) => {
  const fields = getFields(wateringRequest);
  try {
    return await Watering.create(fields, { transaction: txn });
  } catch (e) {
    console.error('Could not create next watering! Error: ', e);
    return null;
  }
}

export const updateWatering = async (watering: Watering, wateringRequest: WateringRequest, txn?: Transaction) => {
  const fields = getFields(wateringRequest);
  try {
    return await watering.update(fields, { transaction: txn });
  } catch (e) {
    console.error('Could not create next watering! Error: ', e);
    return null;
  }
}

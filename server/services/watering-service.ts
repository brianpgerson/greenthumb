import { Watering, STATUS } from '../database';
import { Transaction } from 'sequelize/types';

export interface WateringRequest {
  startDate?: Date,
  endDate?: Date,
  plantId: number,
}

export const createWatering = async (wateringRequest: WateringRequest, txn?: Transaction) => {
  const { startDate: startDateRequest, endDate: endDateRequest, plantId } = wateringRequest;
  const startDate = startDateRequest || new Date(Date.now());
  const endDate  = endDateRequest || null;
  const status = STATUS.PENDING;
  try {
    return await Watering.create({ startDate, endDate, status, plantId }, { transaction: txn });
  } catch (e) {
    console.error('Could not create next watering! Error: ', e);
    return null;
  }
}

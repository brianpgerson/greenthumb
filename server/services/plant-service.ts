import { Plant } from '../database';
import { Transaction } from 'sequelize/types';

export interface PlantRequest {
  name: string,
  type: string,
  userId: number,
}

export const createPlant = async (plantRequest: PlantRequest, txn?: Transaction ) => {
  try {

    return await Plant.create(plantRequest, { transaction: txn });
  } catch (e) {
    console.error('Could not create plant! Error: ', e);
    return null;
  }
}

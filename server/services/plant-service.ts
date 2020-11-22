import { Plant } from '../database';

export interface PlantRequest {
  name: string,
  type: string,
  userId: number,
}

export const createPlant = async (plantRequest: PlantRequest) => {
  try {
    return await Plant.create(plantRequest);
  } catch (e) {
    console.error('Could not create plant! Error: ', e);
    return null;
  }
}

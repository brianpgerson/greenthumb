import { setApiErrors } from '../actions/appActions';
import { store } from '../reducers';
import { makeRequest } from '../utils/makeRequest';
import { loadPlants } from '../actions/plantActions';

const PLANTS_PATH = '/api/plants';
const WATERING_PATH = '/api/waterings';

export const addPlant = (plantRequest) => 
  makeRequest(PLANTS_PATH, 'POST', JSON.stringify(plantRequest));
export const addAndReloadPlants = async (plantRequest) => {
  await addPlant(plantRequest);
  await retrieveAndReloadPlants()
}

export const updatePlant = (plantRequest, plantId) => 
  makeRequest(`${PLANTS_PATH}/${plantId}`, 'PUT', JSON.stringify(plantRequest));
export const updateAndReloadPlants = async (plantRequest, plantId) => {
  await updatePlant(plantRequest, plantId);
  await retrieveAndReloadPlants()
}

export const retrievePlants = () => makeRequest(PLANTS_PATH, 'GET');
export const retrieveAndReloadPlants = async () => {
  const { plants } = await makeRequest(PLANTS_PATH, 'GET');
  store.dispatch(loadPlants(plants));
}

export const deletePlant = (plantId) => makeRequest(`${PLANTS_PATH}/${plantId}`, 'DELETE');
export const deleteAndReloadPlants = async (plantId) => {
  await deletePlant(plantId);
  await retrieveAndReloadPlants()
}

export const waterPlant = (wateringId, wateringDate) => 
  makeRequest(`${WATERING_PATH}/${wateringId}`, 'PUT', JSON.stringify({ wateringDate }));
export const waterPlantAndReloadPlants = async (wateringId, wateringDate) => {
  await waterPlant(wateringId, wateringDate);
  await retrieveAndReloadPlants()
}
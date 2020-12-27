import { setApiErrors } from '../actions/appActions';
import { store } from '../reducers';
import { makeRequest } from '../utils/makeRequest';
import { loadPlants } from '../actions/plantActions';

const PLANTS_PATH = '/api/plants';

export const addPlant = (plantRequest) => 
  makeRequest(PLANTS_PATH, 'POST', JSON.stringify(plantRequest));

export const updatePlant = (plantRequest, plantId) => 
  makeRequest(`${PLANTS_PATH}/${plantId}`, 'PUT', JSON.stringify(plantRequest));

export const retrievePlants = () => makeRequest(PLANTS_PATH, 'GET');

export const retrieveAndReloadPlants = async () => {
  const { plants } = await makeRequest(PLANTS_PATH, 'GET');
  store.dispatch(loadPlants(plants));
}

export const deletePlant = (plantId) => makeRequest(`${PLANTS_PATH}/${plantId}`, 'DELETE');
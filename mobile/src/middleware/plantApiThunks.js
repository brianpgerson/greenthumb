import { setApiErrors } from '../actions/appActions';
import { store } from '../reducers';
import { makeRequest } from '../utils/makeRequest';

export const addPlant = (plantRequest) => 
  makeRequest('/api/plants', 'POST', JSON.stringify(plantRequest));